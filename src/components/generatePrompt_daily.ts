// promptGenerator for daily advice
export function generatePrompt_daily(variables: {
    NAMEHERE: string;
    MOODHERE: string;
    CONTEXTHERE: string;
    pastCard: string;
    presentCard: string;
    futureCard: string;
}): string {


    FORMAT:
    <A greeting with a personalized touch for ${variables.NAMEHERE}>

    <A brief yet powerful overview of the day ahead, focusing on the synergy of the cards>

    Feelings: ${variables.pastCard} - <Interpretation of ${variables.pastCard}>
    Health: ${variables.presentCard} - <Interpretation of ${variables.presentCard}>
    Thoughts: ${variables.futureCard} - <Interpretation of ${variables.futureCard}>
    Combined Interpretation: <Your most creative and impactful advice, blending all elements>

    Closure: <A memorable sign-off, leaving ${variables.NAMEHERE} inspired>`;
}
