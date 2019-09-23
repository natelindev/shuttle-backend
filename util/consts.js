export default {
  role: {
    admin: 'admin',
    groupOwner: 'groupOwner',
    user: 'user'
  },
  access: {
    public: 'public',
    everyone: 'everyone',
    group: 'group',
    private: 'private'
  },
  path: {
    model: 'model',
    image: 'image'
  },
  option: {
    files: 1,
    dirs: 2,
    all: 3
  },
  rngOption: {
    decimal: 'decimal',
    integer: 'integer',
    string: 'string'
  },
  property: {
    owner: 'owner',
    access: 'access'
  },
  modelBuilder: {
    // (ref.)type(:default)(!)
    regex: /^(?<ref>[a-zA-Z]+\.)?((?<type>[a-zA-Z]+))(:(?<default>.+))?(?<required>!)?$/,
    supportedTypes: ['String', 'Number', 'Date', 'Boolean', 'Id']
  }
};
