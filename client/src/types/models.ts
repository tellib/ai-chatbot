export interface Model {
  id: string
  name: string
  parameters: string
  type: 'llama' | 'mistral' | 'phi' | 'orca' | 'gpt4all'
  quantization: string
}

export interface ModelsData {
  models: Model[]
}
