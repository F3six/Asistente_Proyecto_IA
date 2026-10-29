from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class FolderExplanation(BaseModel):
    folder_name: str
    layer_name: str
    description_simple: str
    expected_contents: str
    architecture_role: str
    naming_conventions: List[str]
    anti_patterns: List[str]
    key_annotations_or_keywords: List[Dict[str, str]]
    example_files: Optional[List[Dict[str, Any]]] = None
    educational_tip: Optional[str] = None


class ComplementaryFile(BaseModel):
    name: str
    path: str
    annotation: str
    layer: str
    responsibility: str


class SuggestionRequest(BaseModel):
    description: str
    framework: Optional[str] = "Spring Boot"


class FileSuggestion(BaseModel):
    framework: str
    detected_intent: str
    primary_file: str
    primary_path: str
    annotation_or_pattern: str
    layer: str
    architectural_responsibility: str
    naming_convention: str
    complementary_files: List[ComplementaryFile]
    checklist: List[Dict[str, str]]
    educational_tip: str
