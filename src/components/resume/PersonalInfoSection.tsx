import React from 'react';
import { cn } from '@/lib/utils';
import { PersonalInfo } from '@/features/resume/types/resume';
import { TemplateSectionProps } from '@/lib/templates/types';
import { templateUtils } from '@/components/templates/BaseTemplate';
import { Mail, Phone, MapPin, Linkedin, Globe, User } from 'lucide-react';

interface PersonalInfoSectionProps extends TemplateSectionProps {
  data: PersonalInfo;
  variant?: 'header' | 'sidebar' | 'compact';
}

/**
 * PersonalInfo section component for resume templates
 * Supports multiple variants and responsive layouts
 */
const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  data,
  template: _template,
  customizations,
  variant = 'header',
  className,
}) => {
  const showIcons = customizations.showIcons;
  const isCompact = variant === 'compact' || customizations.spacing === 'compact';

  // Icon mapping for contact information
  const getContactIcon = (type: string) => {
    const iconProps = { size: 14, className: "inline" };
    switch (type) {
      case 'email': return <Mail {...iconProps} />;
      case 'phone': return <Phone {...iconProps} />;
      case 'location': return <MapPin {...iconProps} />;
      case 'linkedin': return <Linkedin {...iconProps} />;
      case 'portfolio': return <Globe {...iconProps} />;
      default: return null;
    }
  };

  // Build contact information items
  const contactItems = [
    data.email && { type: 'email', value: data.email, href: `mailto:${data.email}` },
    data.phone && { type: 'phone', value: data.phone, href: `tel:${data.phone}` },
    data.location && { type: 'location', value: data.location },
    data.linkedIn && { 
      type: 'linkedin', 
      value: templateUtils.cleanUrl(data.linkedIn), 
      href: data.linkedIn 
    },
    data.portfolio && { 
      type: 'portfolio', 
      value: templateUtils.cleanUrl(data.portfolio), 
      href: data.portfolio 
    },
  ].filter(Boolean);

  const renderContactItem = (item: any) => (
    <div key={item.type} className="resume-contact-item">
      {showIcons && getContactIcon(item.type)}
      {item.href ? (
        <a 
          href={item.href} 
          className="resume-contact-link"
          target={item.type === 'linkedin' || item.type === 'portfolio' ? '_blank' : undefined}
          rel={item.type === 'linkedin' || item.type === 'portfolio' ? 'noopener noreferrer' : undefined}
        >
          {item.value}
        </a>
      ) : (
        <span>{item.value}</span>
      )}
    </div>
  );

  return (
    <div 
      className={cn(
        'resume-personal-info',
        `variant-${variant}`,
        {
          'compact': isCompact,
          'with-icons': showIcons,
        },
        className
      )}
      data-section="personal-info"
    >
      {/* Name */}
      <h1 className="resume-name">
        {data.fullName}
      </h1>

      {/* Contact Information */}
      <div className={cn(
        'resume-contact-info',
        {
          'align-left': variant === 'sidebar',
        }
      )}>
        {contactItems.map(renderContactItem)}
      </div>

      {/* Professional Summary */}
      {data.summary && (
        <div className="resume-summary">
          <p>{data.summary}</p>
        </div>
      )}

      {/* Photo placeholder for templates that support it */}
      {customizations.showPhoto && (
        <div className="resume-photo screen-only">
          <div className="resume-photo-placeholder">
            <User size={48} className="text-gray-400" />
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoSection; 