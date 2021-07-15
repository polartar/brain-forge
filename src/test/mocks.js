import { get, times } from 'lodash'
import { makeId } from 'utils/analyses'
import { ANALYSIS_RESULTS, PROBLEM_ORDER } from 'config/base'

const SITE_ROLES = ['Admin', 'Member', 'None']

export const UserMock = (id = 1) => ({
  id,
  first_name: 'John',
  last_name: 'Doe',
  email: 'johndoe@gmail.com',
  email_verified: true,
  username: 'johndoe',
  site_role: 'Admin',
  site: 1,
  created_studies: [],
  is_superuser: false,
})

export const UsersMock = (count = 1) => {
  let users = []

  for (let id = 1; id <= count; id++) {
    users.push({
      id,
      first_name: `first-${id}`,
      last_name: `last-${id}`,
      email: `email-${id}@email.com`,
      email_verified: count % 2 === 0,
      username: `username-${id}`,
      site_role: SITE_ROLES[id - 1],
      site: id,
      role: count % 2 === 0,
      created_studies: id % 2 === 0 ? [id] : [],
      is_superuser: false,
    })
  }

  return users
}

export const CardSetsMock = (count = 1) => {
  let sets = []
  for (let i = 0; i < count; i++) {
    sets.push({ id: i, name: `card${i}` })
  }

  return sets
}

export const FigureMock = (count = 1) => {
  let figures = []

  for (let i = 0; i < count; i++) {
    figures.push(makeId(10))
  }

  return figures
}

export const SummaryTableMock = (row = 1, col = 1) => {
  let summaryTable = []

  for (let i = 0; i < row; i++) {
    let cols = []
    for (let j = 0; j < col; j++) {
      cols.push(`col${j}`)
    }
    summaryTable.push(cols)
  }

  return summaryTable
}

export const SummaryMock = (count = 1, row = 4, col = 5) => {
  let summary = []

  for (let i = 0; i < count; i++) {
    summary.push(SummaryTableMock(row, col))
  }

  return summary
}

export const FileMock = (id = 1, selected = false, csv = true) => ({
  id,
  name: csv ? 'folder1/test.csv' : 'folder1/test.nii',
  fields: AnalysisFieldsMock(selected),
  files: csv ? ['test.csv'] : ['test.nii'],
  number_of_rows: 10000,
  object: undefined,
  options: { splitFile: true, splitType: 'STRATIFIED' },
  series: SeriesMock(),
  site_info: SiteMock(),
  path: '/home/dev',
  pi_info: { id, username: 'amayer' },
  study_info: StudyMock(),
  scanner_info: ScannerMock(),
  subject_info: SubjectMock(),
  session_info: SessionMock(),
  series_info: SeriesMock(),
  protocol_info: ProtocolData(),
})

export const FilesMock = (count = 3) => {
  let files = []

  for (let i = 0; i < count; i++) {
    files.push(FileMock(i + 1))
  }

  return files
}

export const SolutionMock = () => {
  return {
    name: 'Solution 1',
    description: 'Solution Description',
    analysis_types: [AnalysisTypeMock(1), AnalysisTypeMock(2)],
  }
}

export const TagMock = (id = 1) => ({
  id,
  label: `tag-${id}`,
  studies: [{ id: 1, name: 'study-1' }, { id: 2, name: 'study-2' }],
})

export const TagsMock = (count = 3) => {
  let tags = []

  for (let i = 0; i < count; i++) {
    tags.push(TagMock(i))
  }

  return tags
}

export const AnalysisOptionsMock = (label = 'Regression') => {
  if (label === 'Regression') {
    return {
      name: { value: 'Regression' },
      description: { value: '' },
      formulaEdit: { value: '' },
      formula: { value: 'linear' },
    }
  }

  if (label === 'Polyssifier') {
    return {
      name: { value: 'Poly' },
      description: { value: '' },
      include: {
        value: ['Linear SVM', 'Logistic Regression'],
      },
      scoring: { value: 'auc' },
      n_folds: { value: 10 },
    }
  }

  if (label === 'GICA') {
    return {
      name: { value: 'GroupICA' },
      description: { value: '' },
      algorithm: { value: 'InfoMax' },
      numComponents: { value: 100 },
      group_pca_type: { value: 'subject specific' },
      group_ica_type: { value: 'Spatial ICA' },
      backReconType: { value: 'regular' },
      preproc_type: { value: 'remove mean per timepoint' },
      numReductionSteps: { value: 1 },
      scaleType: { value: 'No scaling' },
      which_analysis: { value: 'standard' },
      ica_template: { value: 'ica' },
      mask: { value: 'default' },
      TR: { value: 2 },
      dummy_scans: { value: 0 },
      numWorkers: { value: 1 },
    }
  }

  if (label === 'dFNC') {
    return {
      name: { value: 'dFNC' },
      description: { value: '' },
      ica_parent: { value: '' },
      ica_algorithm: { value: 'Infomax' },
      ica_num_comps: { value: 20 },
      kmeans_max_iter: { value: 1024 },
      dmethod: { value: 'city' },
      TR: { value: 2 },
      tc_detrend: { value: 3 },
      tc_despike: { value: 'yes' },
      tc_filter: { value: 0.15 },
      wsize: { value: 30 },
      window_alpha: { value: 3 },
      num_clusters: { value: 5 },
    }
  }

  if (label === 'VBM') {
    return {
      name: { value: 'Voxel-based Morphometry' },
      description: { value: '' },
      smoothing_x_mm: { value: 10 },
      smoothing_y_mm: { value: 10 },
      smoothing_z_mm: { value: 10 },
      reorient_params_x_mm: { value: 0 },
      reorient_params_y_mm: { value: 0 },
      reorient_params_z_mm: { value: 0 },
      reorient_params_pitch: { value: 0 },
      reorient_params_roll: { value: 0 },
      reorient_params_yaw: { value: 0 },
      BIAS_REGULARIZATION: { value: 0.0001 },
      FWHM_GAUSSIAN_SMOOTH_BIAS: { value: 60 },
      affine_regularization: { value: 'mni' },
      warping_regularization: { value: [0, 0.0001, 0.5, 0.05, 0.2] },
      sampling_distance: { value: 3 },
      mrf_weighting: { value: 1 },
      cleanup: { value: 1 },
      smoothing_implicit_masking: { value: true },
    }
  }

  if (label === 'fMRI') {
    return {
      name: { value: 'fMRI Preprocessing' },
      description: { value: '' },
      smoothing_x_mm: { value: 10 },
      smoothing_y_mm: { value: 10 },
      smoothing_z_mm: { value: 10 },
      reorient_params_x_mm: { value: 0 },
      reorient_params_y_mm: { value: 0 },
      reorient_params_z_mm: { value: 0 },
      reorient_params_pitch: { value: 0 },
      reorient_params_roll: { value: 0 },
      reorient_params_yaw: { value: 0 },
      smoothing_implicit_masking: { value: false },
      realign_fwhm: { value: 8 },
      realign_interp: { value: 2 },
      realign_quality: { value: 1 },
      realign_register_to_mean: { value: true },
      realign_separation: { value: 4 },
      realign_wrap: { value: [0, 0, 0] },
      realign_write_interp: { value: 4 },
      realign_write_wrap: { value: [0, 0, 0] },
      realign_write_mask: { value: true },
      realign_write_which: { value: [2, 1] },
      slicetime_ref_slice: { value: 1 },
      normalize_affine_regularization_type: { value: 'mni' },
      normalize_write_bounding_box: {
        value: [[-78, -112, -70], [78, 76, 85]],
      },
      normalize_write_interp: { value: 1 },
      normalize_write_voxel_sizes: { value: [3, 3, 3] },
      num_slices: { value: 2 },
      acquisition_order: { value: 3 },
      repetition_time: { value: 4 },
    }
  }

  if (label === 'fMRI_32ch') {
    return {
      name: { value: 'fMRI Preprocessing (32 ch)' },
      description: { value: '' },
      group_analysis: false,
      Epi_Base: { value: 0 },
      Tshift: { value: 'off' },
      Epi2Anat: { value: true },
      FWHM_fmri: { value: [6, 6, 6] },
      Args_alEpiAnat: { value: '-anat_has_skull no' },
      Args_Nwarp: { value: ' -short -newgrid 3.0' },
    }
  }

  if (label === 'DTI') {
    return {
      name: { value: 'DTI Preprocessing' },
      description: { value: '' },
      group_analysis: false,
      Mask: { value: true },
      Frac: { value: 0.15 },
      Repol: { value: true },
      Multiband_Factor: { value: 3 },
      Is_Shelled: { value: true },
      Estimate_Skeleton: { value: false },
      Tag: { value: '32ch' },
      Sigma: { value: 1.25 },
      Mporder: { value: 8 },
      Use_Cuda: { value: true },
      Niter: { value: 8 },
      Slice2Vol_Lambda: { value: 1 },
      Slice2Vol_Niter: { value: 5 },
      Slice2Vol_Interp: { value: 'trilinear' },
    }
  }

  if (label === 'Freesurfer') {
    return {
      name: { value: 'Freesurfer' },
      description: { value: '' },
    }
  }

  if (label === 'Freesurfer7') {
    return {
      name: { value: 'FreeSurfer 7' },
      description: { value: 'FreeSurfer 7 description' },
    }
  }

  if (label === 'DKI') {
    return {
      name: { value: 'DKI Preprocessing' },
      description: { value: '' },
    }
  }

  if (label === 'SPMGLM') {
    return {
      name: { value: 'SPM-GLM' },
      description: { value: '' },
      Timing_Units: { value: 'scans' },
      TR: { value: 0.46 },
      Bases: {
        value: 'hrf',
        params: {
          derivs: [2, 0],
        },
      },
      HPF_Cutoff: { value: 128 },
      Runs: { value: [] },
      Estimation_Method: { value: 'Classical' },
      Contrasts: { value: [] },
      Use_FWE_Correction: { value: true },
      Height_Threshold: { value: 0.001 },
    }
  }

  if (label === 'GroupSPMGLM') {
    return {
      name: { value: 'Group SPM-GLM' },
      description: { value: 'Group SPM-GLM' },
      Design_Type: { value: 'One Sample T-Test' },
      Estimation_Method: { value: 'Classical' },
      Scans_Source: { value: 'datafile' },
      Contrasts: { value: [] },
      Use_FWE_Correction: { value: true },
      Height_Threshold: { value: 0.05 },
    }
  }

  if (label === 'ASL') {
    return {
      name: { value: 'ASL' },
      description: { value: '' },
      group_analysis: false,
      TIs: { value: [2.7] },
      ASL_Type: { value: false },
      Bolus_Duration: { value: 1.51 },
      WP: { value: true },
      IAF: { value: 'tc' },
      IBF: { value: 'rpt' },
      T1b: { value: 1.65 },
      Spatial_Flag: { value: true },
      TR_Calib: { value: 4.3 },
      Calib_Method: { value: 'voxel' },
      CGain: { value: 1 },
      Alpha: { value: 0.85 },
      Artoff: { value: true },
      Fixbolus: { value: true },
    }
  }

  if (label === 'MANCOVA') {
    return {
      name: { value: 'MANCOVA' },
      description: { value: '' },
      group_analysis: true,
      ica_parent: { value: '' },
      TR: { value: 2 },
      covariates: { value: '' },
      features: {
        value: ['spatial maps', 'timecourses spectra', 'fnc correlations'],
      },
      interactions: { value: [] },
      p_threshold: { value: 1.0 },
    }
  }

  if (label === 'fMRI_PhantomQA') {
    return {
      name: { value: 'Functional MRI Phantom Quality Assurance' },
      description: { value: '' },
      group_analysis: false,
      slice: { value: '' },
      si_col_start_factor: { value: 3 / 8 },
      si_col_width_factor: { value: 1 / 4 },
      si_row_start_factor: { value: 3 / 8 },
      si_row_width_factor: { value: 1 / 4 },
      snr_im_col_start_factor: { value: 14 / 32 },
      snr_im_col_width_factor: { value: 1 / 8 },
      snr_im_row_start_factor: { value: 15 / 32 },
      snr_im_row_width_factor: { value: 1 / 16 },
      snr_bg_col_start_factor: { value: 29 / 32 },
      snr_bg_col_width_factor: { value: 1 / 16 },
      snr_bg_row_start_factor: { value: 3 / 16 },
      snr_bg_row_width_factor: { value: 1 / 8 },
      ghost_im_col_start_factor: { value: 14 / 32 },
      ghost_im_col_width_factor: { value: 1 / 8 },
      ghost_im_row_start_factor: { value: 15 / 32 },
      ghost_im_row_width_factor: { value: 1 / 16 },
      ghost_bg_col_start_factor: { value: 29 / 32 },
      ghost_bg_col_width_factor: { value: 1 / 16 },
      ghost_bg_row_start_factor: { value: 3 / 16 },
      ghost_bg_row_width_factor: { value: 1 / 8 },
    }
  }

  if (label === 'WMH') {
    return {
      name: { value: 'White Matter Hyperintensities' },
      description: { value: '' },
      group_analysis: false,
      Base_Space: { value: 'T1' },
      BrainMaskFeatureNum: { value: 1 },
      QuerySubjectNum: { value: 1 },
      LabelFeatureNum: { value: 3 },
      TrainingNums: { value: 'all' },
      SelectPts: { value: 'noborder' },
      TrainingPts: { value: 2000 },
      NonLesPts: { value: 2000 },
      Patch3D: { value: true },
      PatchSizes: { value: [3] },
      FeatureSubset: { value: [1, 2] },
      MatFeatureNum: { value: 4 },
      SpatialWeight: { value: 1 },
      Postprocess_Threshold: { value: 0.7 },
    }
  }
}

export const AnalysisFieldsMock = (selected = false) => {
  let fields = {}

  const field_names = ['c1', 'c2', 'c3', 'c4', 'c5', 'y']

  field_names.forEach((name, idx) => {
    fields[idx] = {
      index: idx,
      name,
      data_type: 'numeric',
      selected,
      effect: 'fixed',
      transformation: undefined,
      variable_role: 'x',
      variable_type: 'continuous',
    }
  })

  fields[field_names.length - 1].variable_role = 'y'

  return fields
}

export const AnalysisFieldsAllMock = variable_role => {
  let fields = {}

  const field_names = ['c1', 'c2', 'c3', 'c4', 'c5', 'y']

  field_names.forEach((name, idx) => {
    fields[idx] = {
      index: idx,
      name,
      data_type: 'numeric',
      selected: false,
      effect: 'fixed',
      transformation: undefined,
      variable_role: variable_role || (idx % 2 ? 'x' : 'y'),
      variable_type: 'continuous',
    }
  })

  fields[0].selected = true

  return fields
}

export const AnalysisFieldsValidMock = () => {
  return [
    {
      index: 0,
      name: 'y',
      data_type: 'numeric',
      selected: true,
      effect: 'fixed',
      transformation: undefined,
      variable_role: 'y',
      variable_type: 'continuous',
    },
    {
      index: 1,
      name: 'c1',
      data_type: 'numeric',
      selected: true,
      effect: 'fixed',
      transformation: undefined,
      variable_role: 'x',
      variable_type: 'continuous',
    },
  ]
}

export const AnalysisTypeMock = (id = 1, solutionSetId = 1, label = 'Regression') => ({
  id,
  description: `AT Description ${id}`,
  name: label,
  label,
  parameters: {},
  solution_set: solutionSetId,
  options: AnalysisOptionsMock(label),
})

export const AllAnalysisTypesMock = () => [
  {
    id: 1,
    name: 'Ordinary Least Squares Regression',
    label: 'Regression',
    description: 'Linear Regression',
    modality: 1,
    options: AnalysisOptionsMock('Regression'),
    parameters: {},
    solution_set: 1,
  },

  {
    id: 2,
    name: 'Polyssifier',
    label: 'Polyssifier',
    description: 'Classification via Polyssifier',
    modality: 1,
    options: AnalysisOptionsMock('Polyssifier'),
    parameters: {},
    solution_set: 2,
  },

  {
    id: 3,
    name: 'Group ICA',
    label: 'GICA',
    description: 'Group ICA',
    modality: 3,
    options: AnalysisOptionsMock('GICA'),
    parameters: {},
    solution_set: 3,
  },

  {
    id: 4,
    name: 'dFNC',
    label: 'dFNC',
    description: 'Dynamic Functional Network Connectivity',
    modality: 3,
    options: AnalysisOptionsMock('dFNC'),
    parameters: {},
    solution_set: 4,
  },

  {
    id: 5,
    name: 'Voxel-based Morphometry',
    label: 'VBM',
    description: 'Voxel-based Morphometry',
    modality: 2,
    options: AnalysisOptionsMock('VBM'),
    parameters: {},
    solution_set: 5,
  },

  {
    id: 6,
    name: 'fMRI Preprocessing',
    label: 'fMRI',
    description: 'fMRI Preprocessing',
    modality: 3,
    options: AnalysisOptionsMock('fMRI'),
    parameters: {},
    solution_set: 6,
  },

  {
    id: 7,
    name: 'DTI Preprocessing',
    label: 'DTI',
    description: 'DTI Preprocessing',
    modality: 1,
    options: AnalysisOptionsMock('DTI'),
    parameters: {},
    solution_set: 7,
  },

  {
    id: 8,
    name: 'Freesurfer',
    label: 'Freesurfer',
    description: 'Freesurfer',
    modality: 1,
    options: AnalysisOptionsMock('Freesurfer'),
    parameters: {},
    solution_set: 5,
  },

  {
    id: 9,
    name: 'DKI Preprocessing',
    label: 'DKI',
    description: 'Difussional Kurtosis Imaging Preprocessing',
    modality: 1,
    options: AnalysisOptionsMock('DKI'),
    parameters: {},
    solution_set: 7,
  },

  {
    id: 10,
    name: 'SPM-GLM Level 1',
    label: 'SPMGLM',
    description:
      'The pipeline automates generation of SPM Level1 Model, estimation of model and estimation of contrasts.',
    modality: 1,
    options: AnalysisOptionsMock('SPMGLM'),
    parameters: {},
    solution_set: 8,
  },

  {
    id: 11,
    name: 'SPM-GLM Level 2',
    label: 'GroupSPMGLM',
    description:
      'The pipeline automates generation of SPM Level2 Model, estimation of model and estimation of contrasts.',
    modality: 1,
    options: AnalysisOptionsMock('GroupSPMGLM'),
    parameters: {},
    solution_set: 9,
  },

  {
    id: 12,
    name: 'fMRI Preprocessing (32 ch)',
    label: 'fMRI_32ch',
    description: 'This analysis preprocesses fMRI data collected with a 32 channel coil.',
    options: AnalysisOptionsMock('fMRI_32ch'),
    parameters: {},
    solution_set: 6,
    modality: 3,
  },

  {
    id: 13,
    name: 'MANCOVA',
    label: 'MANCOVA',
    description: 'Multivariate analysis of covariance.',
    options: AnalysisOptionsMock('MANCOVA'),
    parameters: {},
    solution_set: 10,
    modality: 1,
  },

  {
    id: 14,
    name: 'Arterial Spin Labeling',
    label: 'ASL',
    description: 'Arterial Spin Labeling (ASL) MRI pipeline for the quantification of perfusion.',
    options: AnalysisOptionsMock('ASL'),
    parameters: {},
    solution_set: 11,
    modality: 6,
  },

  {
    id: 15,
    name: 'Functional MRI Phantom Quality Assurance',
    label: 'fMRI_PhantomQA',
    description: 'Functional MRI quality assurance routines for gel phantom.',
    options: AnalysisOptionsMock('fMRI_PhantomQA'),
    parameters: {},
    solution_set: 12,
    modality: 3,
  },

  {
    id: 16,
    name: 'White Matter Hyperintensities',
    label: 'WMH',
    description: 'White Matter Hyperintensities Segmentation Pipeline for MRIs.',
    options: AnalysisOptionsMock('WMH'),
    parameters: {},
    solution_set: 13,
    modality: 2,
  },

  {
    id: 17,
    name: 'FreeSurfer 7',
    label: 'Freesurfer7',
    description: 'FreeSurfer 7',
    modality: 1,
    options: AnalysisOptionsMock('Freesurfer7'),
    parameters: {},
    solution_set: 5,
  },
]

export const ProblemsMock = (count = 6) => {
  let problems = []

  for (let i = 1; i <= count; i++) {
    problems.push(ProblemMock(i))
  }

  return problems
}

export const ProblemMock = (id = 1) => ({
  id,
  name: get(PROBLEM_ORDER, id - 1),
  description: `Problem Description ${id}`,
  solution_sets: [SolutionSetMock(1, id), SolutionSetMock(2, id)],
})

export const SolutionSetMock = (id = 1, problemSetId = 1) => ({
  id,
  name: `SolutionSet Name ${id}`,
  description: `SolutionSet Description ${id}`,
  problem_set: problemSetId,
  analysis_types: [AnalysisTypeMock(1), AnalysisTypeMock(2)],
})

export const TasksMock = (count = 5) => {
  let tasks = []

  for (let i = 1; i <= count; i++) {
    tasks.push(TaskMock(i))
  }

  return tasks
}

export const TaskMock = (id = 1, status = ANALYSIS_RESULTS.Complete) => ({
  id,
  date_time_start: '2018-11-07 00:38:40',
  date_time_end: '2018-11-07 00:39:40',
  description: `Task Description ${id}`,
  name: `Task Name ${id}`,
  analysis_type: 1,
  user: 1,
  has_figures: true,
  provenance: status === ANALYSIS_RESULTS.Complete ? ProvenanceMock() : null,
  status,
})

export const ProvenanceMock = () => ({
  cpuinfo: { flags: [], brand: 'abc' },
  meminfo: {
    active: 5141626880,
    available: 5982826496,
    free: 838488064,
    inactive: 0,
    percent: 65.2,
    total: 17179869184,
    used: 8286928896,
  },
  mac_addr: '65:fb:c7:25:34:1a',
  python: {
    python_build: 'default Jun 17 2018 12:13:06',
    python_compiler: 'GCC 4.2.1 Compatible Apple LLVM 9.1.0 (clang-902.0.39.2)',
    python_implementation: 'CPython',
    python_version: '3.6.5',
  },
  platform: {
    libc_ver: '',
    machine: 'x86_64',
    node: 'machine',
    platform: 'Darwin-18.2.0-x86_64-i386-64bit',
    processor: 'i386',
    release: '18.2.0',
  },
  docker: {
    version: '1.0.0',
  },
  python_packages: {
    docker: {},
  },
  os_packages: {
    lib: {},
  },
})

export const ErrorMock = () => ({
  response: {
    data: [{ email: ['user with this email address already exists.'] }],
    status: 401,
  },
})

export const AnalysisMock = (props = {}) => ({
  id: 1,
  analysis_type: 1,
  label: 'Regression',
  name: 'Regression',
  status: 'Pending',
  shared_users: UsersMock(3),
  input_file: FileMock(),
  created_by: UserMock(),
  ...props,
})

export const ModalitiesMock = () => [
  { id: 1, full_name: 'Generic Data', label: 'generic', protocol: [1, 3, 9] },
  { id: 2, full_name: 'Structural MRI', label: 'sMRI', protocol: [1, 2, 9] },
  { id: 3, full_name: 'Functional MRI', label: 'fMRI', protocol: [1, 3, 9] },
  { id: 4, full_name: 'Diffusion MRI', label: 'dMRI', protocol: [1] },
  { id: 5, full_name: 'Electroencephalography', label: 'EEG', protocol: [1, 3] },
  { id: 6, full_name: 'DTI', label: 'DTI', protocol: [1, 3] },
]

export const ProtocolsMock = () => {
  const modalities = ModalitiesMock()

  return [
    { id: 1, name: 'localizer', modalities },
    { id: 2, name: 't2_tse_tra_192', modalities: [modalities[1]] },
    { id: 3, name: 'ep2d_bold_freq_adj', modalities: [modalities[0], modalities[2], modalities[4]] },
    { id: 4, name: 'mprage_5e_RMS', modalities: [modalities[0]] },
    { id: 5, name: 'mprage_5e', modalities: [] },
    { id: 6, name: 'dti_35dir', modalities: [] },
    { id: 7, name: 'AOT_V01_R03', modalities: [] },
    { id: 8, name: 'AOT_V01_R01', modalities: [] },
    { id: 9, name: 'AOT_V01_R02', modalities: [modalities[0], modalities[1], modalities[2]] },
  ]
}

export const ProtocolMappingMock = (id = 1) => {
  return {
    id: id,
    study: StudyMock(id),
    protocol: { id: id, full_name: `protocol-${id}` },
    modalities: ModalitiesMock(),
  }
}

export const ProtocolMappingsMock = (count = 2) => {
  let mappings = []

  for (let i = 1; i <= count; i++) {
    mappings.push(ProtocolMappingMock(i))
  }

  return mappings
}

export const ProtocolDetailMock = () => [
  {
    PI: 'amayer',
    analysis_type: 5,
    id: 9,
    modality: 2,
    parameter_set: 6,
    protocol: 1,
    site: 'human',
    study: 'cobre01_63001',
  },
  {
    PI: 'amayer',
    analysis_type: 3,
    id: 10,
    modality: 3,
    parameter_set: 4,
    protocol: 1,
    site: 'human',
    study: 'cobre01_63001',
  },
]

export const SubjectMock = (id = 1) => ({
  id,
  study: StudyMock(id),
  anon_id: `anon_${id}`,
  tags: [],
})

export const SubjectsMock = (count = 3) => {
  let subjects = []

  for (let id = 1; id <= count; id++) {
    subjects.push(SubjectMock(id))
  }

  return subjects
}

export const SessionMock = (id = 1) => ({
  id,
  subject: SubjectMock(id),
  segment_interval: `segment_${id}`,
  anonymized_scan_date: '2019-10-28T21:05:21Z',
  source_id: id,
  source_created_at: '2019-10-28T21:05:21Z',
  scanner: ScannerMock(id),
  tags: [],
})

export const SessionsMock = (count = 3) => {
  let sessions = []

  for (let id = 1; id <= count; id++) {
    sessions.push(SessionMock(id))
  }

  return sessions
}

export const SeriesMock = (id = 1) => ({
  id,
  anon_date: '2019-10-28T21:05:21Z',
  anon_path:
    'human/dicom/triotim/jstephen/devcog_20908/A00075135/559416279_Session1/rest_closed_oddURSIfirst_32ch_mb8_v01_r02',
  label: 'rest_closed_oddURSIfirst_32ch_mb8_v01_r02',
  modality: ModalitiesMock()[id],
  protocol: ProtocolsMock()[id],
  session: id,
  sort_order: 6,
  source_id: 2915026,
  study_code_label: 'Complete',
})

export const MultipleSeriesMock = (count = 3) => {
  let series = []

  for (let id = 1; id <= count; id++) {
    series.push(SeriesMock(id))
  }

  return series
}

export const ProtocolData = (id = 1, addPlan = true) => ({
  id,
  full_name: `full_name_${id}`,
  label: `label_${id}`,
  protocols: [],
  plans: addPlan ? ProtocolDetailMock() : [],
})

export const ProtocolDataMock = (count = 3) => {
  let res = []

  for (let i = 0; i < count; i++) {
    res.push(ProtocolData(i))
  }

  return res
}

export const DataDirectoryMock = () => ({
  pageSize: 2,
  currentPage: 1,
  totalCount: 2,
  results: [
    { id: 1, PI: 'amayer', protocol: 1, series: SeriesMock(), plan: [] },
    { id: 2, PI: 'rjung', protocol: 2, series: SeriesMock(), plan: [] },
  ],
})

export const AnalysesMock = () => [
  {
    id: 1,
    name: 'AOT_V01_R02_0005 - fMRI Preprocessing',
    analysis_type: 6,
    date_time_start: '2019-05-20T02:08:56.994852Z',
    status: 'Complete',
    results: {},
    parameters: {},
    provenance: 'prov',
    input_file: FileMock(1),
    created_by: UsersMock(1),
  },
  {
    id: 2,
    name: 'AOT_V01_R02_0005 - dFNC',
    analysis_type: 4,
    date_time_start: '2019-05-20T02:08:56.992412Z',
    status: 'Error',
    results: {},
    parameters: {
      analysis: {
        analysisType: 1,
      },
    },
    provenance: null,
    input_file: FileMock(2),
    created_by: UsersMock(2),
  },
]

export const DataDirectorySummaryMock = () => ({
  ready_to_run: 5,
  running: 4,
  complete: 3,
  error: 2,
})

export const MembersMock = (count = 1) => {
  return UsersMock(count)
}

export const SiteMock = (id = 1) => ({
  id,
  full_name: `Site ${id}`,
  label: `site-${id}`,
  invites: InvitesMock(3),
  members: MembersMock(3),
  created_at: '2019-11-21T13:46:03.422546Z',
  created_by: id,
  source_id: null,
  is_managed: id % 2 === 0,
})

export const InviteMock = (id = 1, site = 1) => ({
  id,
  email: `mail-${id}@email.com`,
  sent_date: '2019-07-23',
  site,
  created_by: 1,
})

export const InvitesMock = (count = 1, site = 1) => {
  let invites = []

  for (let id = 1; id <= count; id++) {
    invites.push(InviteMock(id, site))
  }

  return invites
}

export const SitesMock = (count = 1) => {
  let sites = []

  for (let id = 1; id <= count; id++) {
    sites.push(SiteMock(id))
  }

  return sites
}

export const StudyMock = (id = 1) => ({
  id,
  full_name: `Study-${id}`,
  label: `study-${id}`,
  site: SiteMock(id),
  principal_investigator: UserMock(id),
  shared_users: [],
  data_providers: [],
  sent_date: '2019-07-01',
  created_by: UserMock(id),
  created_at: '2019-11-21T16:05:00.247624Z',
  hrrc_num: null,
  is_managed: false,
  source_id: null,
  has_plan: id % 2 === 0,
  all_protocols: [
    {
      id: 1,
      full_name: 'test_csv',
    },
    {
      id: 2,
      full_name: 'test_func',
    },
    {
      id: 3,
      full_name: 'test_anat',
    },
  ],
  tags: [],
})

export const StudiesMock = (count = 1) => {
  let studies = []

  for (let id = 1; id <= count; id++) {
    studies.push(StudyMock(id))
  }

  return studies
}

export const ParameterSetMock = (id = 1, analysisType = 1, label = 'Regression') => ({
  id,
  name: `Parameter Set ${id}`,
  description: `Parameter Set Desc - ${id}`,
  options: AnalysisOptionsMock(label),
  version: 1,
  is_custom: false,
  analysis_type: analysisType,
  shared_users: UsersMock(3),
  created_by: 1,
})

export const ParameterSetsMock = () => [
  ParameterSetMock(1, 1, 'Regression'),
  ParameterSetMock(2, 2, 'Polyssifier'),
  ParameterSetMock(3, 3, 'Group ICA'),
]

export const NotificationMock = (id = 1) => ({
  id,
  message: `Messsage ${id}`,
  sent_date: '2017-07-01',
  user: 1,
})

export const NotificationsMock = (count = 1) => {
  let notifications = []

  for (let id = 0; id < count; id++) {
    notifications.push(NotificationMock(id))
  }

  return notifications
}

export const ScannerMock = (id = 1) => ({
  id,
  site: SiteMock(),
  full_name: `Scanner ${id}`,
  label: `scanner-${id}`,
  model: `model-${id}`,
  manufacturer: `manufacturer-${id}`,
  station: `station-${id}`,
  field_strength: id,
  source_id: id % 2 === 0 ? id : null,
  datafiles_count: id % 3,
  is_managed: id % 3 === 0,
  created_by: {
    id: 1,
  },
})

export const ScannersMock = (count = 3) => {
  let scanners = []

  for (let i = 1; i <= count; i++) {
    scanners.push(ScannerMock(i))
  }

  return scanners
}

export const PreprocessingSummaryMock = () => ({
  id: 3,
  full_name: 'The Dev-CoG Study: Quantifying Brain Dynamics and Related Genetic Factors in Childhood',
  label: 'devcog',
  principal_investigator: UserMock(),
  site: SiteMock(),
  shared_users: [],
  data_providers: [],
  sent_date: '2019-07-01',
  created_by: UserMock(),
  created_at: '2019-11-21T16:05:00.247624Z',
  hrrc_num: null,
  is_managed: false,
  source_id: null,
  has_plan: true,
  session_count: 20,
  subject_count: 10,
  all_protocols: [
    {
      id: 1,
      full_name: 'test_csv',
    },
    {
      id: 2,
      full_name: 'test_func',
    },
    {
      id: 3,
      full_name: 'test_anat',
    },
  ],
  analysis_plans: [
    {
      id: 1,
      protocol: {
        id: 28,
        full_name: 't1w_32ch_mpr_1mm',
      },
      modality: {
        id: 2,
        full_name: 'Structural MRI',
      },
      analysis_type: {
        id: 5,
        name: 'Voxel-based Morphometry',
        label: 'VBM',
      },
      parameter_set: {
        id: 5,
        name: 'Voxel-based Morphometry DEFAULT',
      },
    },
    {
      id: 2,
      protocol: {
        id: 28,
        full_name: 't1w_32ch_mpr_1mm',
      },
      modality: {
        id: 2,
        full_name: 'Structural MRI',
      },
      analysis_type: {
        id: 8,
        name: 'Freesurfer',
        label: 'Freesurfer',
      },
      parameter_set: {
        id: 6,
        name: 'Freesurfer DEFAULT',
      },
    },
    {
      id: 3,
      protocol: {
        id: 6,
        full_name: 'distortion_corr_32ch_pa',
      },
      modality: {
        id: 3,
        full_name: 'Functional MRI',
      },
      analysis_type: {
        id: 3,
        name: 'Group ICA',
        label: 'GICA',
      },
      parameter_set: {
        id: 3,
        name: 'Group ICA DEFAULT',
      },
    },
    {
      id: 4,
      protocol: {
        id: 7,
        full_name: 'distortion_corr_32ch_ap',
      },
      modality: {
        id: 3,
        full_name: 'Functional MRI',
      },
      analysis_type: {
        id: 4,
        name: 'dFNC',
        label: 'dFNC',
      },
      parameter_set: {
        id: 4,
        name: 'dFNC DEFAULT',
      },
    },
    {
      id: 5,
      protocol: {
        id: 8,
        full_name: 'rest_closed_oddURSIfirst_32ch_mb8_v01_r02_SBRef',
      },
      modality: {
        id: 3,
        full_name: 'Functional MRI',
      },
      analysis_type: {
        id: 12,
        name: 'fMRI Preprocessing (32 ch)',
        label: 'fMRI_32ch',
      },
      parameter_set: {
        id: 8,
        name: 'fMRI Preprocessing (32 ch) DEFAULT',
      },
    },
    {
      id: 6,
      protocol: {
        id: 9,
        full_name: 'rest_closed_oddURSIfirst_32ch_mb8_v01_r02',
      },
      modality: {
        id: 3,
        full_name: 'Functional MRI',
      },
      analysis_type: {
        id: 10,
        name: 'SPM-GLM Level 1',
        label: 'SPMGLM',
      },
      parameter_set: {
        id: 11,
        name: 'SPM-GLM Level 1 DEFAULT',
      },
    },
    {
      id: 7,
      protocol: {
        id: 10,
        full_name: 'rest_open_evenURSIfirst_32ch_mb8_v01_r01',
      },
      modality: {
        id: 3,
        full_name: 'Functional MRI',
      },
      analysis_type: {
        id: 6,
        name: 'fMRI Preprocessing',
        label: 'fMRI',
      },
      parameter_set: {
        id: 7,
        name: 'fMRI Preprocessing DEFAULT',
      },
    },
    {
      id: 8,
      protocol: {
        id: 11,
        full_name: 'Multisensory_32ch_mb8_v01_r01_SBRef',
      },
      modality: {
        id: 3,
        full_name: 'Functional MRI',
      },
      analysis_type: {
        id: 11,
        name: 'SPM-GLM Level 2',
        label: 'GroupSPMGLM',
      },
      parameter_set: {
        id: 12,
        name: 'SPM-GLM Level 2 DEFAULT',
      },
    },
  ],
  analyses: [
    {
      id: 4,
      name: 'A00063526-539827881_Session1-t1w_32ch_mpr_1mm-Freesurfer',
      parameter_set: 6,
      status: 'Pending',
      subject_info: {
        id: 3,
        anon_id: 'A00063526',
      },
      protocol_info: {
        id: 28,
        full_name: 't1w_32ch_mpr_1mm',
      },
      session_info: {
        id: 542,
        segment_interval: 'Session2',
      },
    },
    {
      id: 3,
      name: 'A00063526-539827881_Session1-t1w_32ch_mpr_1mm-VBM',
      parameter_set: 5,
      status: 'Error',
      subject_info: {
        id: 3,
        anon_id: 'A00063526',
      },
      protocol_info: {
        id: 28,
        full_name: 't1w_32ch_mpr_1mm',
      },
      session_info: {
        id: 541,
        segment_interval: '1',
      },
    },
    {
      id: 2,
      name: 'A00063499-540447219_Session1-distortion_corr_32ch_ap-dFNC',
      parameter_set: 4,
      status: 'Complete',
      subject_info: {
        id: 4,
        anon_id: 'A00063499',
      },
      protocol_info: {
        id: 7,
        full_name: 'distortion_corr_32ch_ap',
      },
      session_info: {
        id: 542,
        segment_interval: 'Session2',
      },
    },
    {
      id: 1,
      name: 'A00063499-540447219_Session1-Multisensory_32ch_mb8_v01_r01_SBRef-GroupSPMGLM',
      parameter_set: 12,
      status: 'Pending',
      subject_info: {
        id: 4,
        anon_id: 'A00063499',
      },
      protocol_info: {
        id: 11,
        full_name: 'Multisensory_32ch_mb8_v01_r01_SBRef',
      },
      session_info: {
        id: 541,
        segment_interval: 'Session1',
      },
    },
  ],
})

export const SummarySessionsMock = () => [
  {
    id: 2,
    segment_interval: 'Session1',
    subject: 'A00063372',
    analyses: [],
    has_missing_files: false,
    analysis_plans: [
      {
        id: 8,
        study: 3,
        protocol: 11,
        modality: 3,
        analysis_type: 11,
        parameter_set: 12,
        created_by: 1,
      },
      {
        id: 8,
        study: 3,
        protocol: 11,
        modality: 3,
        analysis_type: 11,
        parameter_set: 12,
        created_by: 1,
      },
    ],
  },
  {
    id: 172,
    segment_interval: 'Session3',
    subject: 'A00063526',
    analyses: [],
    has_missing_files: true,
    analysis_plans: [
      {
        id: 1,
        study: 3,
        protocol: 28,
        modality: 2,
        analysis_type: 5,
        parameter_set: 5,
        created_by: 1,
      },
      {
        id: 2,
        study: 3,
        protocol: 28,
        modality: 2,
        analysis_type: 8,
        parameter_set: 6,
        created_by: 1,
      },
    ],
  },
  {
    id: 105,
    segment_interval: 'Session2',
    subject: 'A00063526',
    analyses: [],
    has_missing_files: true,
    analysis_plans: [
      {
        id: 1,
        study: 3,
        protocol: 28,
        modality: 2,
        analysis_type: 5,
        parameter_set: 5,
        created_by: 1,
      },
      {
        id: 2,
        study: 3,
        protocol: 28,
        modality: 2,
        analysis_type: 8,
        parameter_set: 6,
        created_by: 1,
      },
    ],
  },
  {
    id: 3,
    segment_interval: 'Session1',
    subject: 'A00063526',
    analyses: [
      {
        id: 4,
        parameter_set: 6,
        status: 'Pending',
        protocol_info: {
          id: 28,
          full_name: 't1w_32ch_mpr_1mm',
        },
      },
      {
        id: 3,
        parameter_set: 6,
        status: 'Error',
        protocol_info: {
          id: 28,
          full_name: 't1w_32ch_mpr_1mm',
        },
      },
    ],
    has_missing_files: false,
    analysis_plans: [
      {
        id: 1,
        study: 3,
        protocol: 28,
        modality: 2,
        analysis_type: 5,
        parameter_set: 5,
        created_by: 1,
      },
      {
        id: 2,
        study: 3,
        protocol: 28,
        modality: 2,
        analysis_type: 8,
        parameter_set: 6,
        created_by: 1,
      },
    ],
  },
  {
    id: 195,
    segment_interval: 'Session3',
    subject: 'A00063499',
    analyses: [
      {
        id: 14,
        parameter_set: 6,
        status: 'ReadyToRun',
        protocol_info: {
          id: 28,
          full_name: 't1w_32ch_mpr_1mm',
        },
      },
    ],
    has_missing_files: true,
    analysis_plans: [
      {
        id: 1,
        study: 3,
        protocol: 28,
        modality: 2,
        analysis_type: 5,
        parameter_set: 5,
        created_by: 1,
      },
      {
        id: 2,
        study: 3,
        protocol: 28,
        modality: 2,
        analysis_type: 8,
        parameter_set: 6,
        created_by: 1,
      },
    ],
  },
  {
    id: 131,
    segment_interval: 'Session2',
    subject: 'A00063499',
    analyses: [],
    has_missing_files: true,
    analysis_plans: [
      {
        id: 1,
        study: 3,
        protocol: 28,
        modality: 2,
        analysis_type: 5,
        parameter_set: 5,
        created_by: 1,
      },
      {
        id: 2,
        study: 3,
        protocol: 28,
        modality: 2,
        analysis_type: 8,
        parameter_set: 6,
        created_by: 1,
      },
    ],
  },
  {
    id: 4,
    segment_interval: 'Session1',
    subject: 'A00063499',
    analyses: [
      {
        id: 2,
        parameter_set: 4,
        status: 'Complete',
        protocol_info: {
          id: 7,
          full_name: 'distortion_corr_32ch_ap',
        },
      },
      {
        id: 1,
        parameter_set: 12,
        status: 'Pending',
        protocol_info: {
          id: 11,
          full_name: 'Multisensory_32ch_mb8_v01_r01_SBRef',
        },
      },
    ],
    has_missing_files: false,
    analysis_plans: [
      {
        id: 1,
        study: 3,
        protocol: 28,
        modality: 2,
        analysis_type: 5,
        parameter_set: 5,
        created_by: 1,
      },
      {
        id: 2,
        study: 3,
        protocol: 28,
        modality: 2,
        analysis_type: 8,
        parameter_set: 6,
        created_by: 1,
      },
    ],
  },
  {
    id: 171,
    segment_interval: 'Session3',
    subject: 'A00063929',
    analyses: [],
    has_missing_files: true,
    analysis_plans: [
      {
        id: 1,
        study: 3,
        protocol: 28,
        modality: 2,
        analysis_type: 5,
        parameter_set: 5,
        created_by: 1,
      },
      {
        id: 2,
        study: 3,
        protocol: 28,
        modality: 2,
        analysis_type: 8,
        parameter_set: 6,
        created_by: 1,
      },
    ],
  },
  {
    id: 100,
    segment_interval: 'Session2',
    subject: 'A00063929',
    analyses: [],
    has_missing_files: true,
    analysis_plans: [
      {
        id: 1,
        study: 3,
        protocol: 28,
        modality: 2,
        analysis_type: 5,
        parameter_set: 5,
        created_by: 1,
      },
      {
        id: 2,
        study: 3,
        protocol: 28,
        modality: 2,
        analysis_type: 8,
        parameter_set: 6,
        created_by: 1,
      },
    ],
  },
  {
    id: 5,
    segment_interval: 'Session1',
    subject: 'A00063929',
    analyses: [],
    has_missing_files: true,
    analysis_plans: [
      {
        id: 1,
        study: 3,
        protocol: 28,
        modality: 2,
        analysis_type: 5,
        parameter_set: 5,
        created_by: 1,
      },
      {
        id: 2,
        study: 3,
        protocol: 28,
        modality: 2,
        analysis_type: 8,
        parameter_set: 6,
        created_by: 1,
      },
    ],
  },
]

export const dataFileMock = (id = 1) => ({
  files: [`node-${id}.nii`],
  format: null,
  id,
  modalities: [],
  name: `node-${id}.nii`,
  number_of_rows: 0,
  pi_info: { id: 1, username: 'test_pi' },
  protocol_info: { id: 1, full_name: 'test_protocol' },
  scanner_info: { id: 1, full_name: 'Test Scanner' },
  series: {
    anon_date: null,
    anon_path: null,
    id: 1,
    is_managed: false,
    label: 'test_series',
    modality: { id: 2, full_name: 'Functional MRI', label: 'fMRI' },
    protocol: { id: 1, full_name: 'test_protocol' },
    session: 1,
    sort_order: 0,
    source_id: null,
    study_code_label: null,
  },
  series_info: { id: 1, label: 'test_series' },
  session_info: { id: 1, segment_interval: 'test_session' },
  site_info: { id: 1, full_name: 'Microsoft' },
  init_info: { id: 1, full_name: 'init' },
  source: 0,
  study_info: { id: 1, full_name: 'Test Study' },
  subject_info: { id: 1, anon_id: 'test_subject' },
})

export const dataFilesMock = (count = 1) => {
  const dataFiles = times(count, index => dataFileMock(index))

  return dataFiles
}

export const miscFileMock = (id = 1) => ({
  created_at: '2011-01-01',
  created_by: id,
  description: null,
  file: `file-${id}.csv`,
  id: id,
  study: {
    created_at: `2011-01-01`,
    id,
    full_name: 'Test Study',
    label: 'test_study',
    is_managed: false,
  },
})

export const miscFilesMock = (count = 1) => {
  const dataMiscFiles = times(count, index => miscFileMock(index))

  return dataMiscFiles
}

export const PhantomAnalysisMocks = [
  {
    id: 1,
    name: 'Phantom QA 1',
    date_time_start: '2020-10-22T17:46:24.503757Z',
    date_time_end: '2020-10-22T17:46:56.692731Z',
    anon_date: '2020-11-26T08:59:48.235086Z',
    series: 'test_series',
    session: 'test_session',
    fmri_phantom_qa_data: [
      {
        slice: 0.0,
        signal: 463.876828125,
        signal_p2p: 0.4294647585766386,
        snr: 104.30399604845184,
        ghost: 3.468109724942478,
      },
      {
        slice: 1.0,
        signal: 501.5571796875,
        signal_p2p: 0.42134403325991665,
        snr: 103.07488739034596,
        ghost: 3.193074147636089,
      },
      {
        slice: 2.0,
        signal: 533.59359375,
        signal_p2p: 0.41434858399665714,
        snr: 85.53456163767723,
        ghost: 3.449854112232815,
      },
      {
        slice: 3.0,
        signal: 561.1455234375,
        signal_p2p: 0.4030538702590058,
        snr: 80.68288522339675,
        ghost: 3.5312396172124014,
      },
      {
        slice: 4.0,
        signal: 583.079921875,
        signal_p2p: 0.3892315898482506,
        snr: 79.8933706143869,
        ghost: 3.55415823261453,
      },
      {
        slice: 5.0,
        signal: 599.5817890625,
        signal_p2p: 0.4156543019588302,
        snr: 80.36108804940339,
        ghost: 3.5986969919435277,
      },
      {
        slice: 6.0,
        signal: 609.9038203125,
        signal_p2p: 0.3625059273882182,
        snr: 80.09484040680255,
        ghost: 3.575976543445224,
      },
      {
        slice: 7.0,
        signal: 615.2920234375,
        signal_p2p: 0.3637754374736112,
        snr: 78.92940962894899,
        ghost: 3.702073359416666,
      },
      {
        slice: 8.0,
        signal: 616.3201015625,
        signal_p2p: 0.3378165412294061,
        snr: 86.92057872351917,
        ghost: 3.5438081329691715,
      },
      {
        slice: 9.0,
        signal: 614.3238359375,
        signal_p2p: 0.31284395746537946,
        snr: 94.38638770744477,
        ghost: 3.5225836548850267,
      },
      {
        slice: 10.0,
        signal: 610.6744609375,
        signal_p2p: 0.31791181295179377,
        snr: 94.07779667737623,
        ghost: 3.612687209273184,
      },
      {
        slice: 11.0,
        signal: 606.6890546875,
        signal_p2p: 0.3560565718649197,
        snr: 102.09788667209209,
        ghost: 3.612413383819804,
      },
      {
        slice: 12.0,
        snr: 110.00516034828357,
        ghost: 3.616713931909749,
      },
      {
        slice: 13.0,
        signal: 603.4030546875,
        signal_p2p: 0.35540609768882325,
        snr: 111.36188031411837,
        ghost: 3.6154445893244516,
      },
      {
        slice: 14.0,
        signal: 606.0351484375,
        signal_p2p: 0.3570853118964235,
        snr: 106.69543118185588,
        ghost: 3.639547310461199,
      },
      {
        slice: 15.0,
        signal: 611.6293046875,
        signal_p2p: 0.3212474835560566,
        snr: 104.83048634262452,
        ghost: 3.6338177407362977,
      },
    ],
  },
  {
    id: 2,
    name: 'Phantom QA 2',
    date_time_start: '2020-10-20T18:24:12.992244Z',
    date_time_end: '2020-10-20T18:24:45.520727Z',
    anon_date: '2020-11-26T08:59:48.235086Z',
    series: 'test_series',
    session: 'test_session',
    fmri_phantom_qa_data: [
      {
        slice: 0.0,
        signal: 463.876828125,
        signal_p2p: 0.4294647585766386,
        snr: 104.30399604845184,
        ghost: 3.468109724942478,
      },
      {
        slice: 1.0,
        signal: 501.5571796875,
        signal_p2p: 0.42134403325991665,
        snr: 103.07488739034596,
        ghost: 3.193074147636089,
      },
      {
        slice: 2.0,
        signal: 533.59359375,
        signal_p2p: 0.41434858399665714,
        snr: 85.53456163767723,
        ghost: 3.449854112232815,
      },
      {
        slice: 3.0,
        signal: 561.1455234375,
        signal_p2p: 0.4030538702590058,
        snr: 80.68288522339675,
        ghost: 3.5312396172124014,
      },
      {
        slice: 4.0,
        signal: 583.079921875,
        signal_p2p: 0.3892315898482506,
        snr: 79.8933706143869,
        ghost: 3.55415823261453,
      },
      {
        slice: 5.0,
        signal: 599.5817890625,
        signal_p2p: 0.4156543019588302,
        snr: 80.36108804940339,
        ghost: 3.5986969919435277,
      },
      {
        slice: 6.0,
        signal: 609.9038203125,
        signal_p2p: 0.3625059273882182,
        snr: 80.09484040680255,
        ghost: 3.575976543445224,
      },
      {
        slice: 7.0,
        signal: 615.2920234375,
        signal_p2p: 0.3637754374736112,
        snr: 78.92940962894899,
        ghost: 3.702073359416666,
      },
      {
        slice: 8.0,
        signal: 616.3201015625,
        signal_p2p: 0.3378165412294061,
        snr: 86.92057872351917,
        ghost: 3.5438081329691715,
      },
      {
        slice: 9.0,
        signal: 614.3238359375,
        signal_p2p: 0.31284395746537946,
        snr: 94.38638770744477,
        ghost: 3.5225836548850267,
      },
      {
        slice: 10.0,
        signal: 610.6744609375,
        signal_p2p: 0.31791181295179377,
        snr: 94.07779667737623,
        ghost: 3.612687209273184,
      },
      {
        slice: 11.0,
        signal: 606.6890546875,
        signal_p2p: 0.3560565718649197,
        snr: 102.09788667209209,
        ghost: 3.612413383819804,
      },
      {
        slice: 12.0,
        signal: 603.9583203125,
        signal_p2p: 0.32791480527584527,
        snr: 110.00516034828357,
        ghost: 3.616713931909749,
      },
      {
        slice: 13.0,
        signal: 603.4030546875,
        signal_p2p: 0.35540609768882325,
        snr: 111.36188031411837,
        ghost: 3.6154445893244516,
      },
      {
        slice: 14.0,
        signal: 606.0351484375,
        signal_p2p: 0.3570853118964235,
        snr: 106.69543118185588,
        ghost: 3.639547310461199,
      },
      {
        slice: 15.0,
        signal: 611.6293046875,
        signal_p2p: 0.3212474835560566,
        snr: 104.83048634262452,
        ghost: 3.6338177407362977,
      },
    ],
  },
]

export const FreeSurferResultMocks = {
  results_by_measure: [
    {
      name: 'abc',
      results: {
        0: [
          ['Dep. Variable:', 'lh_G_Ins_lg_and_S_cent_ins_volume', 'R-squared:', '-inf'],
          ['Model:', 'OLS', 'Adj. R-squared:', '-inf'],
          ['Method:', 'Least Squares', 'F-statistic:', '-1.667'],
          ['Date:', 'Wed, 09 Dec 2020', 'Prob (F-statistic):', '1.00'],
          ['Time:', '13:27:11', 'Log-Likelihood:', '229.48'],
          ['No. Observations:', '9', 'AIC:', '-451.0'],
          ['Df Residuals:', '5', 'BIC:', '-450.2'],
          ['Df Model:', '3', '', ''],
          ['Covariance Type:', 'nonrobust', '', ''],
        ],
        1: [
          ['', 'coef', 'std err', 't', 'P>|t|', '[0.025', '0.975]'],
          ['Intercept', '1520.0000', '3.39e-12', '4.49e+14', '0.000', '1520.000', '1520.000'],
          ['Sex[T.M]', '2.842e-14', '1.87e-12', '0.015', '0.988', '-4.77e-12', '4.83e-12'],
          ['IsPatient[T.True]', '-5.684e-13', '1.9e-12', '-0.299', '0.777', '-5.46e-12', '4.32e-12'],
          ['Age', '-4.263e-14', '7.32e-14', '-0.583', '0.585', '-2.31e-13', '1.45e-13'],
        ],
        2: [
          ['Omnibus:', '1.914', 'Durbin-Watson:', '0.175'],
          ['Prob(Omnibus):', '0.384', 'Jarque-Bera (JB):', '0.956'],
          ['Skew:', '-0.427', 'Prob(JB):', '0.620'],
          ['Kurtosis:', '1.652', 'Cond. No.', '166.'],
        ],
      },
    },
  ],
  results_by_predictor: [
    {
      name: 'Age',
      results: [
        {
          Beta: -3.8199e-11,
          Measure: 'BrainSegVol',
          'Std Err': 6.6352e-11,
          'p-value': 0.58976,
          't-value': -0.5757,
          'sign(t) x abs(log(p))': -0.22933,
        },
      ],
    },
  ],
}
