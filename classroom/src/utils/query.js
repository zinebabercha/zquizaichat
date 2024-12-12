import { HfInference } from "@huggingface/inference";

const client = new HfInference("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");

/**
 * Queries the model for summarization.
 * 
 * @param {Object} data - The input data for the model query.
 * @param {string} data.inputs - The text to be summarized.
 * 
 * @returns {Promise<Object>} - A promise that resolves to the model's response.
 */
export async function query(data) {
    const inputText = data.inputs;
    console.log("this is input text", inputText );

    try {
        const chatCompletion = await client.chatCompletion({
            model: "Qwen/Qwen2.5-Coder-32B-Instruct", // Specify the model you want to use
            messages: [
                {
                    role: "user",
                    content: `Summarize the following text: ${inputText} in a structered way`,
                }
            ],
            max_tokens: 1500,  // You can adjust max tokens based on the size of the text
        });

        // Extract the response content and return it as a parsed object
        const result = chatCompletion.choices[0].message["content"];
        console.log("this is result" , result);
        return  result ;
    } catch (error) {
        console.error("Error in query function:", error);
        throw error;
    }
}
