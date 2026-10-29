import json
from pathlib import Path
from typing import Dict, List, Optional
from ..schemas.framework import FolderExplanation


class GlossaryService:
    """Provee explicaciones didácticas de carpetas y anotaciones según el framework."""

    _cache: Dict[str, dict] = {}

    @classmethod
    def _get_knowledge_base(cls, framework: str) -> dict:
        key = framework.lower().replace(" ", "_")
        if key in cls._cache:
            return cls._cache[key]

        kb_path = Path(__file__).parent.parent / "knowledge" / f"{key}.json"
        if not kb_path.exists():
            # Fallback a spring_boot
            kb_path = Path(__file__).parent.parent / "knowledge" / "spring_boot.json"

        try:
            with open(kb_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                cls._cache[key] = data
                return data
        except Exception:
            return {"folders": {}}

    @classmethod
    def get_explanation(cls, framework: str, folder_name: str) -> Optional[FolderExplanation]:
        kb = cls._get_knowledge_base(framework)
        clean_name = folder_name.strip("/").lower()
        folders = kb.get("folders", {})

        # Búsqueda directa o parcial
        target = folders.get(clean_name)
        if not target:
            for k, v in folders.items():
                if k in clean_name or clean_name in k:
                    target = v
                    break

        if not target:
            return None

        return FolderExplanation(
            folder_name=target.get("folder_name", f"{folder_name}/"),
            layer_name=target.get("layer_name", "Capa Arquitectónica"),
            description_simple=target.get("description_simple", ""),
            expected_contents=target.get("expected_contents", ""),
            architecture_role=target.get("architecture_role", ""),
            naming_conventions=target.get("naming_conventions", []),
            anti_patterns=target.get("anti_patterns", []),
            key_annotations_or_keywords=target.get("key_annotations_or_keywords", []),
            educational_tip=target.get("educational_tip", "")
        )

    @classmethod
    def get_all_folders(cls, framework: str) -> List[FolderExplanation]:
        kb = cls._get_knowledge_base(framework)
        folders = kb.get("folders", {})
        result = []
        for name, data in folders.items():
            result.append(FolderExplanation(
                folder_name=data.get("folder_name", f"{name}/"),
                layer_name=data.get("layer_name", "Capa Arquitectónica"),
                description_simple=data.get("description_simple", ""),
                expected_contents=data.get("expected_contents", ""),
                architecture_role=data.get("architecture_role", ""),
                naming_conventions=data.get("naming_conventions", []),
                anti_patterns=data.get("anti_patterns", []),
                key_annotations_or_keywords=data.get("key_annotations_or_keywords", []),
                educational_tip=data.get("educational_tip", "")
            ))
        return result
