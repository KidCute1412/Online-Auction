import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useState, useEffect } from "react";

const getPageRange = (currentPage: number, totalPages: number, maxVisible: number = 5) => {
    // Always display the first and last pages
    let start = Math.max(2, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages - 1, currentPage + Math.floor(maxVisible / 2));

    // Adjust if currentPage is near the start
    if (currentPage <= Math.ceil(maxVisible / 2)) {
        end = Math.min(totalPages - 1, maxVisible);
        start = 2;
    }
    // Adjust if currentPage is near the end
    if (currentPage > totalPages - Math.ceil(maxVisible / 2)) {
        start = Math.max(2, totalPages - maxVisible + 1);
        end = totalPages - 1;
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    // Include page 1 if not already added
    if (totalPages > 1) {
        if (!pages.includes(1)) {
            pages.unshift(1);
        }
    }
    
    // Include last page if not already added
    if (totalPages > 1 && !pages.includes(totalPages)) {
        pages.push(totalPages);
    }
    
    return pages.filter(p => p >= 1 && p <= totalPages);
};

function findSeparator(array: number[]) {
    const result = [];
    let prev = 0;
    let current;
    
    for (let i = 0; i < array.length; i++) {
        current = array[i];
        if (current === prev + 1) {
            prev = current;
        } else {
            result.push(current - 1);
            prev = current;
        }
    }
    return result;
}

function PaginationComponent({ numberOfPages, currentPage, controlPage } 
    : { numberOfPages?: number, currentPage?: number, controlPage?: (value: number) => void }
) {
    numberOfPages = numberOfPages ?? 0;
    currentPage = currentPage ?? 1;
    const [, setArrayPages] = useState<number[]>([]);
    const pageRange = getPageRange(currentPage, numberOfPages, 3);
    const separator = findSeparator(pageRange);

    useEffect(() => {
        const tempArray = [];
        for (let i = 0; i < numberOfPages; i++) {
            tempArray.push(i);
        }
        setArrayPages(tempArray);
    }, [numberOfPages]);

    return (
        numberOfPages !== 0 && (
            <div className="flex justify-center my-8">
                <Pagination>
                    <PaginationContent className="flex items-center gap-1">
                        <PaginationItem>
                            <PaginationPrevious 
                                onClick={() => controlPage?.(currentPage - 1)}
                                className={currentPage - 1 === 0 ? "pointer-events-none text-muted-foreground/30 opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>
                        
                        {pageRange.map((items, index) => {
                            const isCurrent = items === currentPage;
                            const pageNumber = items;
                            let needSeparator = false;

                            for (let i = 0; i < separator.length; i++) {
                                if (items - 1 === separator[i]) {
                                    needSeparator = true;
                                    break;
                                }
                            }
                            
                            let element = (
                                <PaginationItem key={index}>
                                    <PaginationLink 
                                        onClick={() => controlPage?.(pageNumber)}
                                        isActive={isCurrent}
                                        className="cursor-pointer"
                                    >
                                        {pageNumber}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                            
                            if (needSeparator) {
                                element = (
                                    <div key={`ellipsis-${index}`} className="flex items-center gap-1">
                                        <PaginationItem>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                        {element}
                                    </div>
                                );
                            }
                            return element;
                        })}

                        <PaginationItem>
                            <PaginationNext 
                                onClick={() => controlPage?.(currentPage + 1)}
                                className={currentPage === numberOfPages ? "pointer-events-none text-muted-foreground/30 opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        )
    );
}

export default PaginationComponent;