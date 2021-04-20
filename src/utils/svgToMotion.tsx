/* eslint-disable consistent-return */
import React from 'react';
import { motion, SVGMotionProps } from 'framer-motion';

const MotionSvg = ({ ...props }: SVGMotionProps<SVGSVGElement>) => ({ ...rest }: SVGMotionProps<SVGSVGElement>) => (
    <motion.svg {...props} {...rest} />
);

export const svgToMotion = (svg: React.FC<React.SVGProps<SVGSVGElement>>) => {
    if (typeof svg !== 'function') {
        return () => <svg />;
    }
    return MotionSvg(svg({})?.props);
};
