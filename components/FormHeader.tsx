import React, { ReactNode } from 'react';

import Image, { ImageProps } from 'next/image';

interface FormHeaderProps {
  children: ReactNode;
  className?: string;
}

interface ProfileImageProps extends Omit<ImageProps, 'className'> {
  className?: string;
}

interface FormHeaderComposition {
  Image: React.FC<ProfileImageProps>;
  Content: React.FC<React.ComponentProps<'div'>>;
  Title: React.FC<React.ComponentProps<'h3'>>;
  Description: React.FC<React.ComponentProps<'p'>>;
}

const FormHeader: React.FC<FormHeaderProps> & FormHeaderComposition = ({
  children,
  className = '',
}) => {
  return (
    <div className={`md:h-97px pl-6 flex items-center md:gap-4 ${className}`}>
      {children}
    </div>
  );
};

const ProfileImage: React.FC<ProfileImageProps> = ({
  className = '',
  ...imageProps
}) => {
  return (
    <div className="hidden md:block flex-shrink-0">
      <Image className={className} width={48} height={48} {...imageProps} />
    </div>
  );
};

const Content: React.FC<React.ComponentProps<'div'>> = ({ children }) => {
  return <div className="flex flex-col">{children}</div>;
};

const Title: React.FC<React.ComponentProps<'h3'>> = ({
  children,
  className = '',
}) => {
  return (
    <h3 className={`text-base font-medium md:font-18-28-600 ${className}`}>
      {children}
    </h3>
  );
};

const Description: React.FC<React.ComponentProps<'p'>> = ({
  children,
  className = '',
}) => {
  return (
    <p className={`hidden md:block font-14-20-400 ${className}`}>{children}</p>
  );
};

FormHeader.Image = ProfileImage;
FormHeader.Content = Content;
FormHeader.Title = Title;
FormHeader.Description = Description;

export default FormHeader;
