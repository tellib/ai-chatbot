import { loadModel } from 'gpt4all'

export const model = await loadModel('Meta-Llama-3-8B-Instruct.Q4_0.gguf', {
  modelPath: './models',
})
