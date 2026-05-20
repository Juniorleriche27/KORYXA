from __future__ import annotations

import asyncio
import json
import re
from datetime import datetime, timezone
from typing import Any

from app.core.ai import generate_answer

_JSON_BLOCK_RE = re.compile(r"```(?:json)?\s*(\{.*\})\s*```", re.DOTALL)
_SPLIT_RE = re.compile(r"[^\w]+", re.UNICODE)

_PROJECT_STAGES = {"idea", "validation", "launch", "first_sales", "structuring"}
_BUSINESS_TYPES = {
    "service",
    "saas",
    "agency",
    "commerce",
    "digital_product",
    "training",
    "marketplace",
    "coaching",
    "import_export",
    "fintech",
    "edtech",
    "other",
}
_MAIN_GOALS = {
    "clarify_idea",
    "build_offer",
    "validate_problem",
    "set_price",
    "find_clients",
    "prepare_business_plan",
    "pitch",
    "action_plan",
    "funding",
}
_SCORE_KEYS = (
    "client_clarity",
    "problem_clarity",
    "offer_strength",
    "pricing_coherence",
    "business_model",
    "validation",
    "sales_readiness",
    "execution_readiness",
)
_DIAGNOSIS_KEYS = (
    "client",
    "problem",
    "offer",
    "pricing",
    "business_model",
    "validation",
    "sales",
    "execution",
)
_DEFAULT_DIAGNOSIS = {
    "client": "Le client cible n'est pas encore formule avec assez de precision pour guider l'execution.",
    "problem": "Le probleme central doit etre decrit avec plus de concret, de frequence et de consequence client.",
    "offer": "L'offre reste a clarifier en termes de promesse, livrable et transformation attendue.",
    "pricing": "La logique de prix doit encore etre reliee a la valeur percue et au mode de paiement reel du client.",
    "business_model": "Le modele economique doit preciser revenus, couts cles et mecanique de marge.",
    "validation": "Les preuves terrain et signaux de validation sont encore insuffisants.",
    "sales": "Le canal d'acquisition et le message de vente doivent etre rendus plus operationnels.",
    "execution": "Le projet a besoin d'un plan d'action court terme avec priorites et sorties attendues.",
}


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _as_dict(value: Any) -> dict[str, Any]:
    return value if isinstance(value, dict) else {}


def _clean_text(value: Any) -> str:
    if value is None:
        return ""
    return " ".join(str(value).strip().split())


def _truncate(value: str, limit: int = 320) -> str:
    cleaned = _clean_text(value)
    if len(cleaned) <= limit:
        return cleaned
    return cleaned[: limit - 3].rstrip() + "..."


def _clamp_score(value: Any) -> int:
    try:
        score = int(round(float(value)))
    except Exception:
        score = 0
    return max(0, min(100, score))


def _coerce_string_list(value: Any, limit: int = 7) -> list[str]:
    if not isinstance(value, list):
        return []
    items = [_truncate(item, 180) for item in value if _clean_text(item)]
    return items[:limit]


def _tokenize(*values: str) -> set[str]:
    tokens: set[str] = set()
    for value in values:
        for token in _SPLIT_RE.split(_clean_text(value).lower()):
            if token:
                tokens.add(token)
    return tokens


def _contains_any(text: str, keywords: tuple[str, ...]) -> bool:
    normalized = _clean_text(text).lower()
    return any(keyword in normalized for keyword in keywords)


def _extract_workspace_signals(project_data: dict[str, Any]) -> dict[str, str]:
    workspace = _as_dict(project_data.get("workspace"))
    signals: dict[str, str] = {}
    for module_id, module_state in workspace.items():
        state = _as_dict(module_state)
        inputs = _as_dict(state.get("inputs"))
        values = [_clean_text(raw) for raw in inputs.values() if _clean_text(raw)]
        output = _clean_text(state.get("output"))
        retention = _clean_text(state.get("retention"))
        combined = values[:3]
        if retention:
            combined.append(retention)
        elif output:
            combined.append(output)
        if combined:
            signals[str(module_id)] = " | ".join(_truncate(item, 140) for item in combined[:3])
    return signals


def _infer_business_type(tokens: set[str], joined_text: str) -> str:
    rules = (
        ("saas", ("saas", "software", "logiciel", "app", "application", "plateforme")),
        ("agency", ("agency", "agence")),
        ("marketplace", ("marketplace", "marcheplace", "market-place")),
        ("training", ("training", "formation", "cours", "academy", "academie")),
        ("coaching", ("coaching", "coach", "mentorat", "mentoring")),
        ("digital_product", ("ebook", "template", "digital", "numerique", "guide")),
        ("commerce", ("boutique", "shop", "store", "vente", "produits", "retail", "ecommerce")),
        ("import_export", ("import", "export", "douane", "container", "grossiste")),
        ("fintech", ("fintech", "mobile money", "paiement", "payment", "wallet", "credit")),
        ("edtech", ("edtech", "school", "ecole", "learning", "education")),
        ("service", ("service", "consulting", "prestation", "freelance")),
    )
    for value, keywords in rules:
        if any(keyword in joined_text for keyword in keywords):
            return value
        if any(keyword in tokens for keyword in keywords):
            return value
    return "other"


def _infer_main_goal(current_step: str, joined_text: str, instruction: str) -> str:
    current = _clean_text(current_step).lower()
    text = f"{joined_text} {instruction}".lower()
    if "fund" in text or "financement" in text or "invest" in text or "subvention" in text:
        return "funding"
    if "pitch" in text or current == "pitch_vente":
        return "pitch"
    if "business plan" in text or current == "business_plan":
        return "prepare_business_plan"
    if "prix" in text or "pricing" in text or current == "prix":
        return "set_price"
    if "client" in text or "vente" in text or "whatsapp" in text or "acquisition" in text:
        return "find_clients"
    if current == "probleme" or "probleme" in text or "problem" in text:
        return "validate_problem"
    if current == "offre_valeur" or "offre" in text or "value proposition" in text:
        return "build_offer"
    if "plan d'action" in text or "action plan" in text or "execution" in text:
        return "action_plan"
    return "clarify_idea"


def _infer_project_stage(
    status: str,
    current_step: str,
    project_data: dict[str, Any],
    scores: dict[str, int],
    joined_text: str,
) -> str:
    if status in {"completed", "validated"} or scores["global"] >= 75:
        return "structuring"
    if "vente" in joined_text and ("client" in joined_text or "commande" in joined_text or "sales" in joined_text):
        return "first_sales"
    if current_step in {"pitch_vente", "business_plan"} or scores["sales_readiness"] >= 60:
        return "launch"
    if current_step in {"prix", "business_model", "validation_preuves"} or scores["validation"] >= 45:
        return "validation"
    if _as_dict(project_data.get("agent_cadrage_v1")):
        return "validation"
    return "idea"


def _score_from_signal(signal: str, weights: tuple[int, int, int]) -> int:
    if not signal:
        return weights[0]
    length = len(signal)
    if length < 45:
        return weights[1]
    return weights[2]


def _build_scores(workspace_signals: dict[str, str], joined_text: str) -> dict[str, int]:
    scores = {
        "client_clarity": _score_from_signal(workspace_signals.get("client", ""), (15, 38, 68)),
        "problem_clarity": _score_from_signal(workspace_signals.get("probleme", ""), (10, 35, 66)),
        "offer_strength": _score_from_signal(workspace_signals.get("offre", ""), (12, 40, 70)),
        "pricing_coherence": _score_from_signal(workspace_signals.get("prix", ""), (8, 32, 62)),
        "business_model": _score_from_signal(workspace_signals.get("business_model", ""), (10, 36, 64)),
        "validation": 18,
        "sales_readiness": _score_from_signal(workspace_signals.get("vente", ""), (10, 34, 63)),
        "execution_readiness": _score_from_signal(workspace_signals.get("business_plan", ""), (12, 38, 67)),
    }
    validation_bonus = 0
    if _contains_any(joined_text, ("test", "pilote", "preuve", "preuve terrain", "client payant", "commande", "feedback")):
        validation_bonus += 20
    if _contains_any(joined_text, ("whatsapp", "facebook", "instagram", "terrain", "distribution", "mobile money", "cash")):
        scores["sales_readiness"] = _clamp_score(scores["sales_readiness"] + 8)
        scores["execution_readiness"] = _clamp_score(scores["execution_readiness"] + 5)
    scores["validation"] = _clamp_score(scores["validation"] + validation_bonus)
    scores["global"] = round(sum(scores[key] for key in _SCORE_KEYS) / len(_SCORE_KEYS))
    return scores


def _build_diagnosis(workspace_signals: dict[str, str], scores: dict[str, int], project_stage: str, business_type: str) -> dict[str, str]:
    diagnosis = dict(_DEFAULT_DIAGNOSIS)
    if workspace_signals.get("client"):
        diagnosis["client"] = f"Le projet cible deja un segment identifiable : {workspace_signals['client']}."
    if workspace_signals.get("probleme"):
        diagnosis["problem"] = f"Le probleme commence a etre formule de maniere exploitable : {workspace_signals['probleme']}."
    if workspace_signals.get("offre"):
        diagnosis["offer"] = f"L'offre de valeur est partiellement definie : {workspace_signals['offre']}."
    if workspace_signals.get("prix"):
        diagnosis["pricing"] = f"Une hypothese de prix existe deja : {workspace_signals['prix']}."
    if workspace_signals.get("business_model"):
        diagnosis["business_model"] = f"Le modele economique montre deja quelques hypotheses : {workspace_signals['business_model']}."
    if workspace_signals.get("vente"):
        diagnosis["sales"] = f"Le canal de vente ou le pitch sont amorces : {workspace_signals['vente']}."
    if workspace_signals.get("business_plan"):
        diagnosis["execution"] = f"Une base d'execution ou de plan d'action existe deja : {workspace_signals['business_plan']}."
    if project_stage in {"launch", "first_sales", "structuring"}:
        diagnosis["validation"] = "Le projet peut aller au-dela du cadrage pur et doit renforcer les preuves terrain, le paiement et la repetition commerciale."
    if business_type in {"commerce", "import_export"}:
        diagnosis["pricing"] += " Pour ce type d'activite, il faut integrer logistique, stock, cash et rotation."
    if business_type in {"training", "coaching", "service", "agency"}:
        diagnosis["sales"] += " La confiance, le bouche-a-oreille, WhatsApp et les preuves de resultat seront critiques."
    return diagnosis


def _build_strengths(project: dict[str, Any], workspace_signals: dict[str, str], scores: dict[str, int]) -> list[str]:
    strengths: list[str] = []
    title = _clean_text(project.get("title"))
    if title and title != "Projet Founder":
        strengths.append(f"Le projet dispose deja d'un intitule de travail identifiable : {title}.")
    if project.get("opencloud_project_path"):
        strengths.append("Le projet est deja rattache a un workspace documentaire OpenCloud.")
    if workspace_signals.get("client"):
        strengths.append("Le client cible commence a etre decrit, ce qui aide a orienter l'offre.")
    if workspace_signals.get("offre"):
        strengths.append("Une base d'offre existe deja, utile pour construire le dossier vivant.")
    if workspace_signals.get("vente"):
        strengths.append("Le projet mentionne deja un canal de vente ou de distribution.")
    if scores["global"] >= 60:
        strengths.append("Le niveau de maturite global permet de passer vers un plan d'action plus concret.")
    return strengths[:6]


def _build_risks(workspace_signals: dict[str, str], scores: dict[str, int], business_type: str) -> list[str]:
    risks: list[str] = []
    if not workspace_signals.get("probleme"):
        risks.append("Le probleme client n'est pas encore assez concret pour soutenir une vraie validation terrain.")
    if scores["pricing_coherence"] < 40:
        risks.append("Le prix n'est pas encore relie a la valeur percue, au budget client et au mode de paiement reel.")
    if scores["validation"] < 40:
        risks.append("Le projet manque encore de preuves, retours terrain ou premiers signaux de traction.")
    if scores["sales_readiness"] < 45:
        risks.append("Le dispositif d'acquisition client reste trop flou pour generer des ventes rapidement.")
    if business_type in {"commerce", "import_export"}:
        risks.append("La gestion du cash, de la logistique et de la confiance fournisseur peut devenir un point de blocage.")
    elif business_type in {"service", "agency", "coaching", "training"}:
        risks.append("La conversion dependra fortement de la confiance client, des preuves et de la repetition commerciale.")
    return risks[:6]


def _build_missing_information(workspace_signals: dict[str, str], business_type: str) -> list[str]:
    missing: list[str] = []
    if not workspace_signals.get("client"):
        missing.append("Le profil client prioritaire, son contexte et son pouvoir d'achat.")
    if not workspace_signals.get("probleme"):
        missing.append("Le probleme principal, sa frequence et le cout de l'inaction.")
    if not workspace_signals.get("offre"):
        missing.append("Le livrable exact, la promesse et la transformation attendue.")
    if not workspace_signals.get("prix"):
        missing.append("Le prix cible, le mode de paiement et la justification de valeur.")
    if not workspace_signals.get("business_model"):
        missing.append("Les sources de revenus, couts cles et hypothese de marge.")
    if not workspace_signals.get("vente"):
        missing.append("Le canal principal d'acquisition, le message et le premier tunnel de conversion.")
    if business_type in {"commerce", "import_export"}:
        missing.append("Les hypotheses de stock, livraison, approvisionnement et rotation de tresorerie.")
    return missing[:7]


def _build_recommended_next_step(main_goal: str, project_stage: str) -> str:
    mapping = {
        "clarify_idea": "Transformer l'idee en offre ciblee autour d'un client prioritaire et d'un probleme urgent.",
        "build_offer": "Structurer une offre simple, vendable et testable rapidement sur le terrain.",
        "validate_problem": "Verifier que le probleme est reel, frequent et suffisamment couteux pour declencher un achat.",
        "set_price": "Definir un prix testable, compatible avec la valeur percue et les moyens de paiement locaux.",
        "find_clients": "Passer en acquisition active avec un canal prioritaire et un message de conversion simple.",
        "prepare_business_plan": "Consolider le dossier vivant en hypotheses, actions et indicateurs clairs.",
        "pitch": "Transformer le cadrage en pitch court, concret et orienté decision.",
        "action_plan": "Prioriser un plan d'action 7 jours focalise sur les sorties utiles.",
        "funding": "Stabiliser l'offre, les preuves et le modele avant toute demarche de financement.",
    }
    sentence = mapping.get(main_goal, "Clarifier l'etape la plus critique pour faire avancer le projet.")
    if project_stage == "first_sales":
        return sentence + " L'objectif est maintenant de transformer les premiers signaux en ventes repetables."
    return sentence


def _build_next_best_action(main_goal: str, project_stage: str, business_type: str, workspace_signals: dict[str, str]) -> dict[str, Any]:
    title = "Mener un sprint terrain de clarification client-probleme"
    why = "Le projet a besoin d'un point d'ancrage concret avant d'investir davantage dans le dossier ou le business plan."
    how = [
        "Choisir un segment client prioritaire unique pour les 7 prochains jours.",
        "Lister 5 prospects reels a contacter via WhatsApp, appel ou rencontre directe.",
        "Tester une formulation courte du probleme et noter les reactions.",
        "Identifier ce que le client paie deja, comment il paie et ce qui bloque la confiance.",
    ]
    expected_output = "Une cible prioritaire, un probleme valide ou invalide, et un angle d'offre plus net."

    if main_goal == "set_price":
        title = "Tester un prix simple avec un mode de paiement realiste"
        why = "Le projet doit relier la valeur percue au budget client, au cash disponible et aux usages mobile money ou cash."
        how = [
            "Formuler 2 options de prix maximum.",
            "Tester ces options aupres de 5 prospects reels.",
            "Verifier si le paiement se fait plutot en cash, mobile money, acompte ou echelonne.",
            "Noter les objections et la perception de valeur.",
        ]
        expected_output = "Une premiere fourchette de prix defendable et un mode de paiement prioritaire."
    elif main_goal in {"find_clients", "pitch"} or project_stage in {"launch", "first_sales"}:
        title = "Lancer une boucle de prospection courte et mesurable"
        why = "Le projet doit passer du cadrage a la confrontation commerciale concrete."
        how = [
            "Rediger un message de vente court adapte a WhatsApp ou appel.",
            "Contacter 10 prospects cibles sur un seul canal prioritaire.",
            "Mesurer reponses, objections et conversions vers un rendez-vous ou un paiement.",
            "Ajuster le pitch selon les retours obtenus.",
        ]
        expected_output = "Un canal prioritaire valide, un pitch plus net et des objections reelles documentees."
    elif main_goal == "prepare_business_plan":
        title = "Transformer le cadrage en dossier vivant actionnable"
        why = "Le Founder Builder OS doit servir d'outil de pilotage, pas seulement de document de presentation."
        how = [
            "Consolider le client, le probleme, l'offre et le prix dans une version simple.",
            "Formuler les hypotheses critiques et les actions de validation.",
            "Relier le dossier aux prochaines sorties attendues sur 7 jours.",
            "Documenter les preuves et decisions dans le workspace.",
        ]
        expected_output = "Un dossier vivant exploitable pour agir, pitcher et suivre les prochaines validations."
    if business_type in {"commerce", "import_export"}:
        how.append("Ajouter une verification logistique simple: approvisionnement, stock, livraison et marge nette.")
    return {"title": title, "why": why, "how": how[:5], "expected_output": expected_output}


def _build_suggested_questions(main_goal: str, business_type: str, workspace_signals: dict[str, str]) -> list[str]:
    questions: list[str] = []
    if not workspace_signals.get("client"):
        questions.append("Qui est votre client prioritaire exact, et dans quelle situation achete-t-il ?")
    if not workspace_signals.get("probleme"):
        questions.append("Quel probleme urgent resout le projet, et qu'est-ce que le client perd si rien ne change ?")
    if not workspace_signals.get("offre"):
        questions.append("Quel resultat concret promettez-vous au client en une phrase simple ?")
    if main_goal == "set_price" or not workspace_signals.get("prix"):
        questions.append("Quel prix votre client pourrait-il payer aujourd'hui, par quel mode de paiement reel ?")
    if main_goal in {"find_clients", "pitch"} or not workspace_signals.get("vente"):
        questions.append("Par quel canal allez-vous chercher les 10 prochains prospects: WhatsApp, terrain, reseau, appel ou autre ?")
    if business_type in {"commerce", "import_export"}:
        questions.append("Quel est votre risque principal sur le stock, la livraison ou la tresorerie ?")
    elif business_type in {"service", "training", "coaching", "agency"}:
        questions.append("Quelles preuves de confiance pouvez-vous montrer des maintenant: temoignage, resultat, demo, essai ?")
    return questions[:7]


def _build_roadmap_7_days(main_goal: str, next_best_action: dict[str, Any]) -> list[str]:
    action_title = _clean_text(next_best_action.get("title")) or "Action prioritaire"
    steps = [
        "Jour 1: clarifier l'objectif de la semaine et choisir un seul segment client prioritaire.",
        "Jour 2: preparer le message, le pitch ou l'offre test a confronter au terrain.",
        "Jour 3: contacter ou rencontrer des prospects reels et collecter des retours.",
        "Jour 4: ajuster l'offre, le prix ou le message selon les objections observees.",
        "Jour 5: refaire une deuxieme boucle de test avec la version ajustee.",
        "Jour 6: documenter les apprentissages utiles dans le dossier vivant Founder.",
        f"Jour 7: prendre une decision claire a partir de l'action '{action_title}' et definir la prochaine priorite.",
    ]
    if main_goal == "prepare_business_plan":
        steps[5] = "Jour 6: consolider hypotheses, preuves, actions et chiffres utiles dans le dossier vivant."
    return steps


def build_deterministic_cadrage_analysis(project: dict[str, Any], instruction: str | None = None) -> dict[str, Any]:
    title = _clean_text(project.get("title")) or "Projet Founder"
    status = _clean_text(project.get("status")) or "draft"
    current_step = _clean_text(project.get("current_step")) or "point_de_depart"
    project_data = _as_dict(project.get("project_data"))
    workspace_signals = _extract_workspace_signals(project_data)
    opencloud_project_path = _clean_text(project.get("opencloud_project_path"))
    instruction_text = _clean_text(instruction)
    joined_text = " ".join(
        part
        for part in [
            title,
            status,
            current_step,
            instruction_text,
            opencloud_project_path,
            " ".join(workspace_signals.values()),
            json.dumps(project_data, ensure_ascii=True, default=str),
        ]
        if part
    ).lower()
    tokens = _tokenize(joined_text)

    business_type = _infer_business_type(tokens, joined_text)
    scores = _build_scores(workspace_signals, joined_text)
    main_goal = _infer_main_goal(current_step, joined_text, instruction_text)
    project_stage = _infer_project_stage(status, current_step, project_data, scores, joined_text)
    diagnosis = _build_diagnosis(workspace_signals, scores, project_stage, business_type)
    strengths = _build_strengths(project, workspace_signals, scores)
    risks = _build_risks(workspace_signals, scores, business_type)
    missing_information = _build_missing_information(workspace_signals, business_type)
    recommended_next_step = _build_recommended_next_step(main_goal, project_stage)
    next_best_action = _build_next_best_action(main_goal, project_stage, business_type, workspace_signals)
    suggested_questions = _build_suggested_questions(main_goal, business_type, workspace_signals)
    roadmap_7_days = _build_roadmap_7_days(main_goal, next_best_action)

    summary_parts = [
        f"{title} est analyse comme un projet de stade '{project_stage}' avec une orientation business '{business_type}'.",
        f"Le score global de maturite est estime a {scores['global']}/100.",
        "Le projet doit etre pilote comme un Founder Builder OS: clarifier, documenter, scorer puis executer."
    ]
    if opencloud_project_path:
        summary_parts.append(f"Le workspace OpenCloud est deja en place via {opencloud_project_path}.")
    if instruction_text:
        summary_parts.append(f"Instruction prise en compte: {_truncate(instruction_text, 160)}.")

    return {
        "project_stage": project_stage,
        "business_type": business_type,
        "main_goal": main_goal,
        "summary": " ".join(summary_parts),
        "diagnosis": diagnosis,
        "maturity_scores": scores,
        "strengths": strengths,
        "risks": risks,
        "missing_information": missing_information,
        "recommended_next_step": recommended_next_step,
        "next_best_action": next_best_action,
        "suggested_questions": suggested_questions,
        "roadmap_7_days": roadmap_7_days,
    }


def _normalize_diagnosis(value: Any, fallback: dict[str, str]) -> dict[str, str]:
    payload = _as_dict(value)
    return {
        key: _truncate(payload.get(key) or fallback[key], 320)
        for key in _DIAGNOSIS_KEYS
    }


def _normalize_scores(value: Any, fallback: dict[str, int]) -> dict[str, int]:
    payload = _as_dict(value)
    scores = {key: _clamp_score(payload.get(key, fallback[key])) for key in _SCORE_KEYS}
    scores["global"] = round(sum(scores[key] for key in _SCORE_KEYS) / len(_SCORE_KEYS))
    return scores


def _normalize_next_best_action(value: Any, fallback: dict[str, Any]) -> dict[str, Any]:
    payload = _as_dict(value)
    return {
        "title": _truncate(payload.get("title") or fallback["title"], 140),
        "why": _truncate(payload.get("why") or fallback["why"], 260),
        "how": _coerce_string_list(payload.get("how"), limit=6) or fallback["how"],
        "expected_output": _truncate(payload.get("expected_output") or fallback["expected_output"], 220),
    }


def _normalize_enum(value: Any, allowed: set[str], fallback: str) -> str:
    candidate = _clean_text(value).lower()
    return candidate if candidate in allowed else fallback


def _normalize_analysis(value: Any, fallback: dict[str, Any]) -> dict[str, Any]:
    payload = _as_dict(value)
    normalized = {
        "project_stage": _normalize_enum(payload.get("project_stage"), _PROJECT_STAGES, fallback["project_stage"]),
        "business_type": _normalize_enum(payload.get("business_type"), _BUSINESS_TYPES, fallback["business_type"]),
        "main_goal": _normalize_enum(payload.get("main_goal"), _MAIN_GOALS, fallback["main_goal"]),
        "summary": _truncate(payload.get("summary") or fallback["summary"], 500),
        "diagnosis": _normalize_diagnosis(payload.get("diagnosis"), fallback["diagnosis"]),
        "maturity_scores": _normalize_scores(payload.get("maturity_scores"), fallback["maturity_scores"]),
        "strengths": _coerce_string_list(payload.get("strengths"), limit=6) or fallback["strengths"],
        "risks": _coerce_string_list(payload.get("risks"), limit=6) or fallback["risks"],
        "missing_information": _coerce_string_list(payload.get("missing_information"), limit=7) or fallback["missing_information"],
        "recommended_next_step": _truncate(payload.get("recommended_next_step") or fallback["recommended_next_step"], 260),
        "next_best_action": _normalize_next_best_action(payload.get("next_best_action"), fallback["next_best_action"]),
        "suggested_questions": _coerce_string_list(payload.get("suggested_questions"), limit=7) or fallback["suggested_questions"],
        "roadmap_7_days": _coerce_string_list(payload.get("roadmap_7_days"), limit=7) or fallback["roadmap_7_days"],
    }
    normalized["maturity_scores"]["global"] = round(
        sum(normalized["maturity_scores"][key] for key in _SCORE_KEYS) / len(_SCORE_KEYS)
    )
    return normalized


def _extract_json_payload(raw_text: str) -> dict[str, Any]:
    text = raw_text.strip()
    if not text:
        return {}
    fenced = _JSON_BLOCK_RE.search(text)
    if fenced:
        text = fenced.group(1)
    return _as_dict(json.loads(text))


def _build_llm_prompt(project: dict[str, Any], instruction: str | None, fallback: dict[str, Any]) -> str:
    title = _clean_text(project.get("title")) or "Projet Founder"
    status = _clean_text(project.get("status")) or "draft"
    current_step = _clean_text(project.get("current_step")) or "point_de_depart"
    project_data = json.dumps(_as_dict(project.get("project_data")), ensure_ascii=True, default=str)
    opencloud_project_path = _clean_text(project.get("opencloud_project_path")) or "N/A"
    instruction_block = _clean_text(instruction) or "Aucune instruction additionnelle."
    fallback_json = json.dumps(fallback, ensure_ascii=True, default=str)
    return (
        "Tu es founder_cadrage_v1, mais ton positionnement produit est: Founder Diagnostic & Orientation Agent V1.\n"
        "Tu n'es pas un chatbot. Tu n'es pas un simple generateur de business plan.\n"
        "Tu agis comme un moteur de diagnostic produit structure pour un Founder Builder OS: workspace guide, dossier vivant, scores, actions, exports et execution.\n"
        "Tu dois retourner UNIQUEMENT un JSON valide, sans markdown, sans commentaire et sans texte avant ou apres.\n"
        "Le diagnostic doit orienter vers l'action, pas vers une conversation.\n"
        "Integre si pertinent les realites africaines/locales: WhatsApp, mobile money, cash, confiance client, petits budgets, distribution locale.\n"
        "Schema JSON attendu:\n"
        "{"
        "\"project_stage\": \"idea|validation|launch|first_sales|structuring\","
        "\"business_type\": \"service|saas|agency|commerce|digital_product|training|marketplace|coaching|import_export|fintech|edtech|other\","
        "\"main_goal\": \"clarify_idea|build_offer|validate_problem|set_price|find_clients|prepare_business_plan|pitch|action_plan|funding\","
        "\"summary\": string,"
        "\"diagnosis\": {"
        "\"client\": string,"
        "\"problem\": string,"
        "\"offer\": string,"
        "\"pricing\": string,"
        "\"business_model\": string,"
        "\"validation\": string,"
        "\"sales\": string,"
        "\"execution\": string"
        "},"
        "\"maturity_scores\": {"
        "\"client_clarity\": 0,"
        "\"problem_clarity\": 0,"
        "\"offer_strength\": 0,"
        "\"pricing_coherence\": 0,"
        "\"business_model\": 0,"
        "\"validation\": 0,"
        "\"sales_readiness\": 0,"
        "\"execution_readiness\": 0,"
        "\"global\": 0"
        "},"
        "\"strengths\": [string],"
        "\"risks\": [string],"
        "\"missing_information\": [string],"
        "\"recommended_next_step\": string,"
        "\"next_best_action\": {"
        "\"title\": string,"
        "\"why\": string,"
        "\"how\": [string],"
        "\"expected_output\": string"
        "},"
        "\"suggested_questions\": [string],"
        "\"roadmap_7_days\": [string]"
        "}\n"
        "Contraintes:\n"
        "- scores entre 0 et 100\n"
        "- le score global doit etre coherent avec les autres\n"
        "- style direct, professionnel, actionnable\n"
        "- ne revele aucun secret, token ou detail interne\n"
        "- n'ecris pas comme un assistant conversationnel\n"
        f"Instruction additionnelle: {instruction_block}\n"
        f"Titre: {title}\n"
        f"Statut: {status}\n"
        f"Etape courante: {current_step}\n"
        f"OpenCloud path: {opencloud_project_path}\n"
        f"Project data JSON: {project_data}\n"
        f"Fallback deterministic reference: {fallback_json}\n"
    )


async def run_founder_cadrage_v1(
    project: dict[str, Any],
    instruction: str | None = None,
) -> tuple[dict[str, Any], dict[str, Any]]:
    fallback = build_deterministic_cadrage_analysis(project, instruction=instruction)
    analysis = fallback
    source = "deterministic"
    try:
        prompt = _build_llm_prompt(project, instruction, fallback)
        raw_response = await asyncio.to_thread(
            generate_answer,
            prompt,
            None,
            None,
            90,
            1500,
        )
        candidate = _extract_json_payload(raw_response)
        if candidate:
            analysis = _normalize_analysis(candidate, fallback)
            source = "llm"
    except Exception:
        analysis = fallback
        source = "deterministic"

    patch = {
        "agent_cadrage_v1": {
            "agent": "founder_cadrage_v1",
            "label": "Founder Diagnostic & Orientation Agent V1",
            "version": 1,
            "source": source,
            "generated_at": _now_iso(),
            "instruction": _clean_text(instruction) or None,
            "analysis": analysis,
        }
    }
    return analysis, patch
