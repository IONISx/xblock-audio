"""
Student view for Audio XBlock
"""

from xblock.core import XBlock
from xblock.fields import Scope, Integer
from xblock.fragment import Fragment

from audio.utils import load_resource, render_template


class StudentMixin(object):
    """
    Student view for Tagged Text XBlock
    """

    plays = Integer(
        default=0,
        scope=Scope.user_state,
        help="Number of times the sound was played"
    )

    @property
    def can_play(self):
        return self.max_plays is None or self.plays < self.max_plays

    def _get_sound_url(self):
        if self.can_play:
            return self.file_url

        return None

    def _get_state(self):
        return {
            'plays': self.plays,
            'max_plays': self.max_plays,
            'can_play': self.can_play,
            'options': {
                'autoplay': self.autoplay
            }
        }

    def student_view(self, context=None):
        """
        The primary view of the AudioXBlock, shown to students
        when viewing courses.
        """

        template = render_template('templates/student.html')
        frag = Fragment(template)
        frag.add_css(load_resource('static/style/xblock-audio.min.css'))
        frag.add_javascript(load_resource('static/script/howler.min.js'))
        frag.add_javascript(load_resource('static/script/handlebars.min.js'))
        frag.add_javascript(load_resource('static/script/xblock-audio.min.js'))
        frag.initialize_js('AudioXBlockStudent')
        return frag

    @XBlock.json_handler
    def get_state(self, data, suffix=''):
        state = self._get_state()

        return {
            'state': state,
            'success': True
        }

    @XBlock.json_handler
    def play(self, data, suffix=''):
        if self.can_play:
            self.plays += 1

            return {
                'url': self._get_sound_url(),
                'success': True
            }

        return {
            'success': False
        }
