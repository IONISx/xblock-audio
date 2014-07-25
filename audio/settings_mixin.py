"""
Settings for Audio XBlock
"""

from xblock.core import XBlock
from xblock.fields import Scope, String, Integer, Float, List, Dict

from audio.defaults import DISPLAY_NAME


class SettingsMixin(object):
    """
    Settings for Audio XBlock
    """

    display_name = String(
        default=DISPLAY_NAME,
        display_name="Display Name",
        scope=Scope.settings,
        help="This name appears in the horizontal navigation at the top of the page."
    )

    file_url = String(
        display_name="Sound address",
        scope=Scope.settings,
        help="This is the address of the sound you want to play."
    )

    def has_dynamic_children(self):
        return False

    @property
    def icon_class(self):
        return 'audio'

    @property
    def non_editable_metadata_fields(self):
        """
        Return the list of fields that should not be editable in Studio.
        """
        return [XBlock.tags, XBlock.name]

    @property
    def editable_metadata_fields(self):
        """
        Returns the metadata fields to be edited in Studio. These are fields with scope `Scope.settings`.

        Can be limited by extending `non_editable_metadata_fields`.
        """
        metadata_fields = {}

        # Only use the fields from this class, not mixins
        fields = getattr(self, 'unmixed_class', self.__class__).fields

        for field in fields.values():

            if field.scope != Scope.settings or field in self.non_editable_metadata_fields:
                continue

            metadata_fields[field.name] = self._create_metadata_editor_info(field)

        return metadata_fields

    def _create_metadata_editor_info(self, field):
        """
        Creates the information needed by the metadata editor for a specific field.
        """
        def jsonify_value(field, json_choice):
            if isinstance(json_choice, dict):
                json_choice = dict(json_choice)  # make a copy so below doesn't change the original
                if 'display_name' in json_choice:
                    json_choice['display_name'] = json_choice['display_name']
                if 'value' in json_choice:
                    json_choice['value'] = field.to_json(json_choice['value'])
            else:
                json_choice = field.to_json(json_choice)
            return json_choice

        # gets the 'default_value' and 'explicitly_set' attrs
        metadata_field_editor_info = self.runtime.get_field_provenance(self, field)
        metadata_field_editor_info['field_name'] = field.name
        metadata_field_editor_info['display_name'] = field.display_name
        metadata_field_editor_info['help'] = field.help
        metadata_field_editor_info['value'] = field.read_json(self)

        # We support the following editors:
        # 1. A select editor for fields with a list of possible values (includes Booleans).
        # 2. Number editors for integers and floats.
        # 3. A generic string editor for anything else (editing JSON representation of the value).
        editor_type = "Generic"
        values = field.values
        if isinstance(values, (tuple, list)) and len(values) > 0:
            editor_type = "Select"
            values = [jsonify_value(field, json_choice) for json_choice in values]
        elif isinstance(field, Integer):
            editor_type = "Integer"
        elif isinstance(field, Float):
            editor_type = "Float"
        elif isinstance(field, List):
            editor_type = "List"
        elif isinstance(field, Dict):
            editor_type = "Dict"
        metadata_field_editor_info['type'] = editor_type
        metadata_field_editor_info['options'] = [] if values is None else values

        return metadata_field_editor_info
