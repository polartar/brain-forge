export const AUTH_DATA = 'brainforge/auth/data'

export const SIDEBAR_PINNED = 'brainforge/sidebar_pinned'

export const REDIRECT_URL = 'brainforge/redirect_url'

export const API_BASE_URL = process.env.API_ROOT

export const SOCKET_PATH = process.env.SOCKET_PATH

export const MEDIA_URL = process.env.MEDIA_ROOT
export const UPLOAD_PATH = process.env.UPLOAD_PATH
export const ARCHIVE_PATH = process.env.ARCHIVE_PATH

export const DATA_TYPES = {
  numeric: { code: 'numeric', label: 'Numeric', next: 'string' },
  string: { code: 'string', label: 'String', next: 'numeric' },
}

export const VARIABLE_ROLES = {
  x: { code: 'x', label: 'x', next: 'y' },
  y: { code: 'y', label: 'y', next: 'x' },
}

export const COVARIATE_VARIABLE_ROLES = {
  x: { code: 'x', label: 'noninteractive', next: 'y' },
  y: { code: 'y', label: 'interactive', next: 'x' },
}

export const VARIABLE_TYPES = {
  continuous: {
    code: 'continuous',
    label: 'Continuous',
    next: 'categorical_ordered',
  },
  categorical_ordered: {
    code: 'categorical_ordered',
    label: 'Categorical (ordered)',
    next: 'categorical_unordered',
  },
  categorical_unordered: {
    code: 'categorical_unordered',
    label: 'Categorical (unordered)',
    next: 'continuous',
  },
}

export const COVARIATE_VARIABLE_TYPES = {
  continuous: {
    code: 'continuous',
    label: 'Continuous',
    next: 'categorical_unordered',
  },
  categorical_unordered: {
    code: 'categorical_unordered',
    label: 'Categorical',
    next: 'continuous',
  },
}

export const TRANSFORMATION_TYPES = {
  [undefined]: { code: 'undefined', label: '-', next: 'log' },
  log: { code: 'np.log', label: 'Log', next: 'sqrt' },
  sqrt: { code: 'np.sqrt', label: 'Sqrt', next: undefined },
}

export const VARIABLE_EFFECTS = {
  fixed: { code: 'fixed', label: 'Fixed', next: 'random' },
  random: { code: 'random', label: 'Random', next: 'fixed' },
}

export const FILE_SPLIT_TYPES = {
  PERCENTAGE_50_50: '50-50',
  PERCENTAGE_20_80: '20-80',
  PERCENTAGE_30_70: '30-70',
  STRATIFIED: 'Stratified',
}

export const DEFAULT_FORMULA_TYPE = 'linear'

export const JSON_DECODING_ERROR = 'The server returned a malformed response.'
export const SERVER_ERROR = 'Unexpected server response.'
export const INVALID_FILE_TYPE = 'Invalid file type: Only CSV files are supported.'
export const NO_COLUMNS_SELECTED_ERROR = 'The file needs to have at least 1 column for uploading.'

export const LANGUAGE = {
  email: {
    invalid: 'Invalid email address.',
  },
  password: {
    misMatch: 'The passwords you entered do not match.',
  },
  required: 'Required',
}

export const ICA_TYPES = ['spatial', 'temporal']
export const ICA_ALGORITHMS = [
  'InfoMax',
  'Fast ICA',
  'Erica',
  'Simbec',
  'Evd',
  'Jade Opac',
  'Amuse',
  'SDD ICA',
  'Semi-blind Infomax',
  'Constrained ICA (Spatial)',
  'Radical ICA',
  'Combi',
  'ICA-EBM',
  'ERBM',
  'IVA-GL',
  'GIG-ICA',
  'IVA-L',
]
export const PCA_TYPES = ['subject specific', 'group grand mean']
export const BACK_RECON = ['regular', 'spatial-temporal regression', 'gica3', 'gica', 'gig-ica']
export const PREPROC_TYPES = [
  'remove mean per timepoint',
  'remove mean per voxel',
  'intensity normalization',
  'variance normalization',
]
export const SCALE_TYPE = ['No scaling', 'percent signal change', 'Z-scores']
export const WHICH_ANALYSIS = ['standard', 'ICASSO', 'MST']
export const MANCOVA_FEATURES = {
  'spatial maps': 'Spatial Maps',
  'timecourses spectra': 'Time-Courses Spectra',
  'fnc correlations': 'FNC Correlations',
}
export const INCLUDE = {
  'Multilayer Perceptron': 'Multilayer Perceptron',
  'Nearest Neighbors': 'Nearest Neighbors',
  SVM: 'Support Vector Machine',
  'Linear SVM': 'Linear Support Vector Machine',
  'Decision Tree': 'Decision Tree',
  'Random Forest': 'Random Forest',
  'Ada Boost': 'AdaBoost',
  Bagging: 'Bagging',
  'Gradient Boost': 'Gradient Boost',
  'Logistic Regression': 'Logistic Regression',
  'Ridge Classification': 'Ridge Classification',
  'Ridge Classification CV': 'Ridge Classification with Cross-Validation',
  'Passive Aggressive': 'Passive Aggressive',
  Perceptron: 'Perceptron',
  'Guassian Naive Bayes': 'Guassian Naive Bayes',
  'Bernoulli Naive Bayes': 'Bernoulli Naive Bayes',
  LDA: 'Linear Discriminant Analysis',
  QDA: 'Quadratic Discriminant Analysis',
  'Gaussian Process': 'Gaussian Process',
}

export const FORMULA_TYPES = [
  'constant',
  'linear',
  '2-way interaction',
  '3-way interaction',
  'pure quadratic',
  'full quadratic',
  'custom',
]

export const ANALYSIS_TYPES = [
  'Regression',
  'Polyssifier',
  'GIFT',
  'dFNC',
  'Voxel-based Morphometry',
  'fMRI SPM TPM EPI Preprocessing',
  'DTI Preprocessing',
  'FreeSurfer',
  'DKI Preprocessing',
  'SPM-GLM Level 1',
  'SPM-GLM Group Level',
  'fMRI FSL AFNI T1 Preprocessing',
  'MANCOVA',
  'Arterial Spin Labeling (ASL)',
  'Functional MRI Phantom Quality Assurance',
  'White Matter Hyperintensities',
  'FreeSurfer 7',
  'Freesurfer Regression',
]

export const ANALYSIS_TYPES_ID = {
  Regression: 1,
  Polyssifier: 2,
  GICA: 3,
  dFNC: 4,
  VBM: 5,
  fMRI: 6,
  DTI: 7,
  Freesurfer: 8,
  DKI: 9,
  SPMGLM: 10,
  GroupSPMGLM: 11,
  fMRI_32ch: 12,
  MANCOVA: 13,
  ASL: 14,
  fMRI_PhantomQA: 15,
  WMH: 16,
  Freesurfer7: 17,
  FSR: 18,
}

export const ANALYSIS_ALLOWED_FILE_TYPES = {
  'Ordinary Least Squares Regression': ['csv', 'tsv'],
  Polyssifier: ['csv', 'tsv'],
  'Group ICA': ['nii', 'dcm', 'gz', 'zip', 'tar'],
  'fMRI Preprocessing': ['nii', 'dcm', 'gz', 'zip', 'tar'],
  Freesurfer: ['nii', 'gz', 'dcm'],
  'FreeSurfer 7': ['nii', 'gz', 'dcm'],
  'Voxel-based Morphometry': ['nii', 'dcm', 'gz', 'zip', 'tar'],
  'SPM-GLM Level 1': ['asc', 'nii', '1D'],
  'SPM-GLM Level 2': ['nii', 'img'],
  Mancova: ['csv', 'tsv'],
  mancova: ['csv', 'tsv'],
  MANCOVA: ['csv', 'tsv'],
  fMRI_PhantomQA: ['nii', 'dcm'],
  WMH: ['txt', 'nii', 'nii.gz', 'mat'],
}

export const ANALYSIS_HIDE_VARIABLE_CONFIGURATION = ['VBM', 'fMRI', 'SPMGLM', 'GroupSPMGLM']

export const ANALYSIS_STATES = {
  all: { id: null, name: 'all', defaultSorter: { field: 'date_time_start', order: 'descend' } },
  completed: { id: 'completed', name: 'completed', defaultSorter: { field: 'date_time_end', order: 'descend' } },
  running: { id: 'running', name: 'running', defaultSorter: { field: 'date_time_start', order: 'descend' } },
  success: { id: 2, name: 'success', defaultSorter: { field: 'date_time_start', order: 'descend' } },
  error: { id: 3, name: 'error', defaultSorter: { field: 'date_time_start', order: 'descend' } },
}

export const ANALYSIS_RESULTS = {
  ReadyToRun: 0,
  Running: 1,
  Complete: 2,
  Error: 3,
}

export const ANALYSIS_RESULT_TEXT = {
  0: 'Ready to run',
  1: 'Running',
  2: 'Completed',
  3: 'Failed',
}

export const ANALYSIS_DISMISS_UPLOAD = []
export const ANALYSIS_DISMISS_FILE_SELECT = ['dFNC', 'SPMGLM', 'GroupSPMGLM']
export const ANALYSIS_VARIABLE_CONFIGURATIONS = ['Regression', 'Polyssifier']
export const ANALYSIS_COVARIATE_CONFIGURATIONS = ['mancova', 'MANCOVA', 'Mancova']
export const ANALYSIS_LARGE_UPLOAD = ['GICA', 'SPMGLM', 'GroupSPMGLM']

export const DISTANCE_METHODS = ['city', 'sqEuclidean', 'hamming', 'correlation', 'cosine']

export const TAG_COLORS = [
  'purple',
  'magenta',
  'geekblue',
  'red',
  'volcano',
  'green',
  'orange',
  'blue',
  'gold',
  'lime',
  'cyan',
]

export const PAPAYA_ALLOWED_FILE_TYPES = ['nii', 'dcm', 'nii.gz']
export const PAPAYA_URL = `${MEDIA_URL}/papaya/index.html`

export const SPM_GLM_TIMING_UNITS = ['scans', 'secs']
export const SPM_GLM_BASES = ['hrf', 'fourier', 'fourier_han', 'gamma', 'fir']
export const SPM_GLM_ESTIMATION_METHOD = ['Classical', 'Bayesian', 'Bayesian2']
export const SPM_GLM_CONTRAST_TYPE = ['T', 'F']
export const SPM_GLM_DESIGN_TYPES = [
  'One Sample T-Test',
  'Two Sample T-Test',
  'Paired T-Test',
  'Multiple Regression',
  'ANOVA one-way',
  'ANOVA one-way within subject',
  'Full Factorial',
  'Flexible Factorial',
]
export const METADATA_FILE_EXTS = ['.csv', '.tsv']

export const RESULT_SOURCE = 3
export const MANAGED_SOURCE = 1
export const UPLOADED_SOURCE = 0

export const DATA_DIRECTORY_FILTERS = [
  'name',
  'site',
  'pi',
  'scanner',
  'modality',
  'subject',
  'user',
  'session',
  'status',
  'study',
  'series',
  'protocol',
  'analysis_type',
  'parameter_set',
  'source',
]

export const PROBLEM_ORDER = [
  'Neuroimaging Preprocessing',
  'SPM-GLM',
  'GIFT',
  'Quality Assurance',
  'Statistical Modeling',
  'Classification',
]

export const BREAKPOINTS = {
  XXL: 1440,
  XL: 1200,
  LG: 992,
  MD: 768,
  SM: 576,
  XS: 0,
}

export const NOTIFICATION_TYPES = {
  0: 'invite',
  1: 'download',
}

export const MAX_SELECT_FILES = 300

export const CHART_COLORS = [
  '#2f7ed8',
  '#0d233a',
  '#8bbc21',
  '#910000',
  '#1aadce',
  '#492970',
  '#f28f43',
  '#77a1e5',
  '#c42525',
  '#a6c96a',
]

export const DTI_CONFIG_OPTIONS = ['b02b0.cnf', 'b02b0_1.cnf', 'b02b0_2.cnf', 'b02b0_4.cnf']
export const SLURM_PARTITIONS = ['qTRDBF', 'qTRDGPU', 'qTRDGPUBF', 'qTRDGPUL', 'qTRDGPUM', 'qTRDGPUH']
export const SLURM_DEFAULT_PARTITION = 'qTRDBF'

export const BOOL_FILTERS = [{ text: 'Yes', value: true }, { text: 'No', value: false }]

export const USER_ROLES = [
  { text: 'SuperAdmin', value: 'SuperAdmin' },
  { text: 'SiteAdmin', value: 'SiteAdmin' },
  { text: 'SiteMember', value: 'SiteMember' },
  { text: 'User', value: 'User' },
]

export const SITE_ROLES = [{ text: 'None', value: 0 }, { text: 'Member', value: 1 }, { text: 'Admin', value: 2 }]
