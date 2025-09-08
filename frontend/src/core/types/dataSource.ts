
export interface AuthConfig {
  token?: string;
  apiKey?: string;
  username?: string;
  password?: string;
  headerName?: string;
}

export type AuthType = "none" | "basic" | "bearer" | "apiKey"
export type HttpMethod = "GET" | "POST"
export type DataSourceType = "json" | "csv" | "elasticsearch"
export type DataSourceVisibility = "public" | "private"



interface DataSourceBase {
  name: string;
  type: DataSourceType;
  endpoint?: string;
  config?: Record<string, unknown>;
  visibility: DataSourceVisibility;
  timestampField?: string;
  httpMethod?: HttpMethod;
  authType?: AuthType;
  authConfig?: AuthConfig;
  esIndex?: string;
  esQuery?: string;
}

export interface SourceFormState extends DataSourceBase {
  file?: File | null;
}


export interface DetectParams {
  type: DataSourceType;
  csvOrigin?: "url" | "upload";
  csvFile?: File | null;
  endpoint?: string;
  httpMethod?: HttpMethod;
  authType?: AuthType;
  file?: File;
  authConfig?: AuthConfig;
  esIndex?: string;
  esQuery?: string;
}


export interface DataSource extends DataSourceBase {
  _id: string;
  filePath?: string;
  ownerId: string;
  timestampField?: string;
  createdAt?: string;
  updatedAt?: string;
  isUsed?: boolean;
}




export interface CreateSourcePayload extends DataSourceBase {
  file?: File | null;
}

export interface SourceFormProps {
  form: SourceFormState;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFormField: (field: string, value: any) => void;
  step: number;
  setStep: (s: number) => void;
  csvOrigin: "url" | "upload";
  setCsvOrigin: (v: "url" | "upload") => void;
  csvFile: File | null;
  setCsvFile: (f: File | null) => void;
  columns: { name: string; type: string }[];
  columnsLoading: boolean;
  columnsError: string;
  dataPreview: Record<string, unknown>[];
  showModal: boolean;
  setShowModal: (b: boolean) => void;
  globalError: string;
  handleNext: () => void;
  onSubmit: (data: SourceFormState) => void;
  isEdit?: boolean;
  filePath?: string | null;
  setFilePath?: (v: string | null) => void;
  showFileField?: boolean;
  setShowFileField?: (v: boolean) => void;
  fieldErrors?: Record<string, string>;
}


/**
 * Interface pour les options de sélection des sources
 */
export interface SourceOption {
  value: string;
  label: string;
}





export interface FetchSourceDataOptions {
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
  fields?: string[] | string;
  forceRefresh?: boolean;
  shareId?: string;
}