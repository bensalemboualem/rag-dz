from fastapi import APIRouter, HTTPException
from typing import List

from app.schemas import TTSRequest, TTSResponse, VoiceResponse
from app.services.elevenlabs_service import ElevenLabsService

router = APIRouter()
elevenlabs = ElevenLabsService()


# Available voices for Darija/Arabic
VOICES = [
    VoiceResponse(
        id="darija_male_1",
        name="Ahmed (Darija)",
        language="darija",
        preview_url=None,
        is_custom=True,
    ),
    VoiceResponse(
        id="darija_female_1",
        name="Amina (Darija)",
        language="darija",
        preview_url=None,
        is_custom=True,
    ),
    VoiceResponse(
        id="arabic_male_1",
        name="Youssef (Arabe MSA)",
        language="arabic",
        preview_url=None,
        is_custom=False,
    ),
    VoiceResponse(
        id="french_male_1",
        name="Pierre (Français)",
        language="french",
        preview_url=None,
        is_custom=False,
    ),
    VoiceResponse(
        id="french_female_1",
        name="Marie (Français)",
        language="french",
        preview_url=None,
        is_custom=False,
    ),
]


@router.get("/voices", response_model=List[VoiceResponse])
async def list_voices(language: str = None):
    """List available voices"""
    if language:
        return [v for v in VOICES if v.language == language]
    return VOICES


@router.post("/tts", response_model=TTSResponse)
async def text_to_speech(request: TTSRequest):
    """Generate speech from text"""
    try:
        result = await elevenlabs.generate_speech(
            text=request.text,
            voice_id=request.voice_id,
            language=request.language,
        )
        
        return TTSResponse(
            audio_url=result["audio_url"],
            duration=result["duration"],
            credits=5,  # Fixed credit cost for TTS
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/clone-voice")
async def clone_voice(name: str, audio_files: List[str]):
    """Clone a voice from audio samples"""
    try:
        voice_id = await elevenlabs.clone_voice(name, audio_files)
        return {"voice_id": voice_id, "name": name}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
