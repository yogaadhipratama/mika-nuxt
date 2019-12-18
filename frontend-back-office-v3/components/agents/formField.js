export default [
  {
    key: 'name',
    caption: 'Name',
    fieldType: 'text',
    rules: 'required|max:50',
    type: 'text',
    value: '',
  },
  {
    key: 'username',
    caption: 'Username',
    fieldType: 'text',
    rules: 'required|min:8|max:50',
    type: 'text',
    value: '',
  },
  {
    key: 'generalLocationLong',
    caption: 'General Location Long',
    fieldType: 'text',
    rules: '',
    type: 'point',
    value: 0,
  },
  {
    key: 'generalLocationLat',
    caption: 'General Location Lat',
    fieldType: 'text',
    rules: '',
    type: 'point',
    value: 0,
  },
  {
    key: 'description',
    caption: 'Description',
    fieldType: 'textarea',
    rules: '',
    type: 'text',
    value: '',
  },
  {
    key: 'outletId',
    caption: '',
    fieldType: 'hidden',
    rules: '',
    type: 'hidden',
    value: '',
  },
  {
    key: 'user',
    caption: '',
    fieldType: 'hidden',
    rules: '',
    type: 'hidden',
    value: '',
  },
]
