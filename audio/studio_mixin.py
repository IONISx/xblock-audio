"""
Studio editing view for Audio XBlock
"""

import json

from xblock.core import XBlock
from xblock.fragment import Fragment

from audio.utils import load_resource, render_template


class StudioMixin(object):
    """
    Studio editing view for Tagged Text XBlock
    """

    def studio_view(self, context=None):
        """
        Method to render the Tagged Text XBlock in Studio
        """

        data = {
            'metadata_fields': json.dumps(self.editable_metadata_fields)
        }

        template = render_template('templates/studio.html', data)
        frag = Fragment(template)
        frag.add_javascript(load_resource('static/script/xblock-audio.min.js'))
        frag.initialize_js('AudioXBlockStudio')
        return frag

    @XBlock.json_handler
    def edit(self, data, suffix=''):
        """
        Update the XBlock's settings
        """
        editable_fields = self.editable_metadata_fields

        for metadata_key, metadata in data['metadata'].items():
            if metadata_key not in self.fields:
                return {'success': False, 'msg': 'Field "{name}" does not exist'.format(name=metadata_key)}

            if metadata_key not in editable_fields:
                return {'success': False, 'msg': 'Field "{name}" is not editable'.format(name=metadata_key)}

            value = metadata.get('value')
            field = self.fields[metadata_key]

            if value is None:
                field.delete_from(self)
            else:
                try:
                    value = field.from_json(value)
                except ValueError:
                    return {'success': False, 'msg': 'Invalid data for field {name}'.format(name=metadata_key)}

                field.write_to(self, value)

        return {'success': True, 'msg': 'Successfully updated Audio XBlock'}
