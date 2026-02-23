/**
 * Distributes exercises from different muscle groups in a round-robin fashion.
 * @param {Object} groupedExercises - An object with muscle groups as keys and arrays of exercises as values.
 * @param {number} targetCount - The target number of exercises to be distributed.
 * @returns {Array} - An array of exercises distributed from different muscle groups in a round-robin fashion.
 */

/* This is the Round Robin algorithm */
export function roundRobinDistribute(groupedExercises, targetCount) {
    const muscles = Object.keys(groupedExercises);
    const result = [];
    let added = true;

    while (result.length < targetCount && added) {
        added = false;
        for (const m of muscles) {
            // Check if we've reached the target count for this muscle group
            if (result.length >= targetCount) break;

            /* 
                If there any exercises left in this muscle group, take one and add it to the result.

                The ?. operator ensures we don't get an error if the array is empty or undefined, otherwise it will throw an error.
                
                The shift() method removes the first element from an array and returns that element. This way we ensure a round-robin distribution across muscle groups.
            */
            const ex = groupedExercises[m]?.shift();
            /* 
                If we have an exercise to add, it will be pushed to the result array and we set 'added' to true, so that we can continue to the next muscle group.
            */
            if (ex) {
                result.push(ex);
                added = true;
            }
        }
    }
    return result;  
}
