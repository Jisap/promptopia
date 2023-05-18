import { Schema, model, models } from 'mongoose';

const PromptSchema = new Schema({
  creator: {                        // El campo creator se relacionará con el modelo user
    type: Schema.Types.ObjectId,    // Id del usuario que crea el prompt
    ref: 'User',                    // Relación de uno(user) a muchos(prompt)
  },
  prompt: {
    type: String,
    required: [true, 'Prompt is required.'],
  },
  tag: {
    type: String,
    required: [true, 'Tag is required.'],
  }
});

const Prompt = models.Prompt || model('Prompt', PromptSchema);

export default Prompt;