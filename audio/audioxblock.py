from xblock.core import XBlock

from audio.settings_mixin import SettingsMixin
from audio.student_mixin import StudentMixin
from audio.studio_mixin import StudioMixin


class AudioXBlock(
        XBlock,
        SettingsMixin,
        StudentMixin,
        StudioMixin):
    pass
