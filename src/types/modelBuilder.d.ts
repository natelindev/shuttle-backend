export const modelBuilder: {
    // (ref.)type(:default)(!)
    regex: /^(?<ref>[a-zA-Z]+\.)?((?<type>[a-zA-Z]+))(:(?<default>.+))?(?<required>!)?$/,
    supportedTypes: ['String', 'Number', 'Date', 'Boolean', 'Id']
  }