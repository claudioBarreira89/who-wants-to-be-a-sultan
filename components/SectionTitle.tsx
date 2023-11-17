import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

const SectionTitle = ({ children, className }: { children: ReactNode, className?: string }) => {
  return <h1 className={twMerge("text-xl font-extrabold text-gray-800", className)}>{children}</h1>;
};

export default SectionTitle