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
        scope=Scope.user_state,
        help="Number of times the sound was played"
    )

    def student_view(self, context=None):
        """
        The primary view of the AudioXBlock, shown to students
        when viewing courses.
        """

        template = render_template('templates/student.html')
        frag = Fragment(template)
        frag.add_css(load_resource('static/style/xblock-audio.min.css'))
        frag.add_javascript(load_resource('static/script/howler.min.js'))
        frag.add_javascript(load_resource('static/script/xblock-audio.min.js'))
        frag.initialize_js('AudioXBlockStudent')
        return frag

    @XBlock.json_handler
    def get_sound_url(self, data, suffix=''):
        if self.max_plays and self.plays >= self.max_plays:
            return {
                'success': False,
                'msg': 'User ran out of allowed sound plays'
            }

        return {
            'success': True,
            'url': self.file_url
        }
