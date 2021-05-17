import { useState } from 'react';

export const useForceUpdate = () => {
    const [, setValue] = useState(0); // integer state
    return () => setValue((prev) => prev + 1); // update the state to force render
};
