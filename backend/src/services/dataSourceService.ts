import DataSource from '../models/DataSource';

const dataSourceService = {
  async list() {
    return await DataSource.find();
  },
  async create({ name, type, endpoint, config, ownerId }: any) {
    if (!name || !type || !endpoint || !ownerId) return { error: { message: 'Champs requis manquants.' }, status: 400 };
    const source = await DataSource.create({ name, type, endpoint, config, ownerId });
    return { data: source };
  },
  async getById(id: string) {
    const source = await DataSource.findById(id);
    if (!source) return { error: { message: 'Source non trouvée.' }, status: 404 };
    return { data: source };
  },
  async update(id: string, { name, type, endpoint, config }: any) {
    const source = await DataSource.findByIdAndUpdate(id, { name, type, endpoint, config }, { new: true });
    if (!source) return { error: { message: 'Source non trouvée.' }, status: 404 };
    return { data: source };
  },
  async remove(id: string) {
    const source = await DataSource.findByIdAndDelete(id);
    if (!source) return { error: { message: 'Source non trouvée.' }, status: 404 };
    return { data: { message: 'Source supprimée.' } };
  },
  async detectColumns(endpoint: string) {
    if (!endpoint) return { error: { message: 'Endpoint requis.' }, status: 400 };
    let fetchImpl;
    try {
      fetchImpl = (await import('node-fetch')).default;
    } catch (e) {
      return { error: { message: 'node-fetch non installé.' }, status: 500 };
    }
    try {
      const response = await fetchImpl(endpoint);
      const data = await response.json();
      let columns: string[] = [];
      if (Array.isArray(data) && data.length > 0) {
        columns = Object.keys(data[0]);
      } else if (typeof data === 'object' && data !== null) {
        columns = Object.keys(data);
      }
      return { data: { columns } };
    } catch (err) {
      return { error: { message: 'Impossible de détecter les colonnes.' }, status: 500 };
    }
  },
};

export default dataSourceService;
