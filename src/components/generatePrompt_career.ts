// promptGenerator for career advice
export function generatePrompt_career(variables: {
    NAMEHERE: string;
    MOODHERE: string;
    CONTEXTHERE: string;
    pastCard: string;
    presentCard: string;
    futureCard: string;
}): string {


    Question: Provide a career tarot reading. The three cards are ${variables.pastCard}, ${variables.presentCard}, and ${variables.futureCard}. Note that cards can come in a 'reversed' state, which often gives an alternate meaning of the card. Consider the client's self-given context when interpreting the cards: ${variables.CONTEXTHERE}.

    Answer generation specifics: Think deeply, but value speed in your response. Give career advice according to these aspects: what they are good at, what they love, what the world needs, and what they can get paid for. Then, provide their combined interpretation. Make it unique and creative, allowing for some imaginative insights. This is important.

    FORMAT:
    <Personalized greeting for ${variables.NAMEHERE}>,

    <Concise summary of the combined meaning of the tarot career reading>

    WHAT YOU ARE GOOD AT: ${variables.pastCard} - <Evaluate the card meanings to give career advice about 'what they are good at'>

    WHAT YOU LOVE: ${variables.presentCard} - <Evaluate the card meanings to give career advice about 'what they love'>

    WHAT THE WORLD NEEDS: ${variables.futureCard} - <Evaluate the card meanings to give career advice about 'what the world needs'>

    WHAT YOU CAN GET PAID FOR: ${variables.futureCard} - <Evaluate the card meanings to give career advice about 'what they can get paid for'>

    COMBINED INTERPRETATION: <Specific career advice combining the interpretations of all cards, emphasizing the most important aspects>

    <Memorable sign-off, leaving ${variables.NAMEHERE} inspired. Signed: Your AI Tarot Reader>`;
}
