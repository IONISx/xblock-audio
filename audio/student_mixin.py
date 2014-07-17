"""
Student view for Audio XBlock
"""

from xblock.fragment import Fragment

from audio.utils import load_resource, render_template


class StudentMixin(object):
    """
    Student view for Tagged Text XBlock
    """

    def student_view(self, context=None):
        """
        The primary view of the AudioXBlock, shown to students
        when viewing courses.
        """

        template = render_template('templates/student.html')
        frag = Fragment(template)
        frag.add_css(load_resource('static/style/xblock-audio.min.css'))
        frag.add_javascript(load_resource('static/script/xblock-audio.min.js'))
        frag.initialize_js('AudioXBlockStudent')
        return frag
