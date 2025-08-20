// promptGenerator for situation/action/result reading
export function generatePrompt_action(variables: {
    NAMEHERE: string;
    MOODHERE: string;
    CONTEXTHERE: string;
    pastCard: string;
    presentCard: string;
    futureCard: string;
}): string {


    Question: Provide a situation/action/result tarot reading. The situation card is ${variables.pastCard}, the action card is ${variables.presentCard}, and the outcome card is ${variables.futureCard}. Note that cards can appear in a reversed state, which often gives an alternate meaning. Consider the client's provided context: ${variables.CONTEXTHERE} when interpreting the cards.

    Answer generation specifics: Think deeply, but value speed in your response. Consider interpretations for each situation/action/outcome card individually and then their combined meaning. Interpret each individual card again while remembering their shared meaning. Provide a reading for today using the three card interpretations and their combined interpretation. Make it unique and creative, allowing for some imaginative insights. This is important.

    FORMAT:
    <Personalized greeting for ${variables.NAMEHERE}>,

    <Concise summary of the combined meaning of the tarot reading>

    THE SITUATION: ${variables.pastCard} - <interpretation of the situation card (${variables.pastCard})>
    
    THE ACTION: ${variables.presentCard} - <interpretation of the action card (${variables.presentCard})>

    THE OUTCOME: ${variables.futureCard} - <interpretation of the outcome card (${variables.futureCard})>

    COMBINED INTERPRETATION: <specific advice combining the interpretations of all cards, emphasizing the most important aspects>

    <Memorable sign-off, leaving ${variables.NAMEHERE} inspired. Signed: Your AI Tarot Reader>`;
}
