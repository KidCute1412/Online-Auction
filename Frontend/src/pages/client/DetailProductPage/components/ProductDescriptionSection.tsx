import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FileText, ChevronDown, ChevronUp, Edit3 } from "lucide-react";

interface ProductDescriptionSectionProps {
  description: string;
  isSeller?: boolean;
  isExpired?: boolean;
}

const ProductDescriptionSection: React.FC<ProductDescriptionSectionProps> = ({ description, isSeller, isExpired }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleEditClick = () => {
    navigate(`${location.pathname}/edit`);
  };

  return (
    <div className="bg-card rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-lg">
            <FileText className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Product Description
            </h3>
            <p className="text-sm text-muted-foreground">Detailed product specification and information</p>
          </div>
        </div>
        
        {/* Edit Button */}
        {isSeller && !isExpired && (
          <button
            onClick={handleEditClick}
            className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-gradient-to-r from-accent/80 to-accent text-white rounded-lg hover:from-accent hover:to-accent/90 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm"
          >
            <Edit3 className="w-4 h-4" />
            Edit Description
          </button>
        )}
      </div>

      {/* Content */}
      <div className="prose prose-sm max-w-none pl-4">
        <div
          className={`text-muted-foreground leading-relaxed transition-all duration-300 ${
            isExpanded ? "max-h-none" : "max-h-24 overflow-hidden"
          }`}
          dangerouslySetInnerHTML={{ __html: description || "" }}
        />
        {description && description.length > 200 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent hover:text-accent/90 hover:bg-accent/10 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Show More <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductDescriptionSection;