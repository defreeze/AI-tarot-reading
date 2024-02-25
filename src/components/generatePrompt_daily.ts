// promptGenerator for daily advice
export function generatePrompt_daily(variables: {
    NAMEHERE: string;
    MOODHERE: string;
    CONTEXTHERE: string;
    pastCard: string;
    presentCard: string;
    futureCard: string;
}): string {
    return `Using your deep knowledge of tarot and a touch of creativity, provide a unique reading for ${variables.NAMEHERE}, who is currently feeling ${variables.MOODHERE}. Draw upon the cards: feelings (${variables.pastCard}), health (${variables.presentCard}), and thoughts (${variables.futureCard}), considering ${variables.CONTEXTHERE}. Aim for a reading that is both insightful and imaginative, allowing for unconventional interpretations that resonate on a personal level.

    FORMAT:
    Greeting: A personalized touch for ${variables.NAMEHERE}.

    Summary: A brief yet powerful overview of the week ahead, focusing on the synergy of the cards.

    Detailed Insights:
    Feelings: Interpretation of ${variables.pastCard}.
    Health: Interpretation of ${variables.presentCard}.
    Thoughts: Interpretation of ${variables.futureCard}.
    Combined Interpretation: Your most creative and impactful advice, blending all elements.

    Closure: A memorable sign-off, leaving ${variables.NAMEHERE} inspired.`;
}
