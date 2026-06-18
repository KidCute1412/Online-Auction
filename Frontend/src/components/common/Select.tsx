import {cn} from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


type selectItemType ={
  value : any,
  content: string
}
interface SelectProps {
  items?: selectItemType[];
  placeholder?: string;
  value: any;
  setState: (value: any) => void;
  className?: string;
  name?: string;
  disabled?: boolean;
}

export default function SelectComponent({
  items = [],
  placeholder = "Select...",
  value,
  setState,
  className = "",
  name,
  disabled = false
}: SelectProps) {
  return (
    <div className={cn("w-full", className)}>
      <Select 
        value={value} 
        onValueChange={(val) => !disabled && setState(val)} 
        name={name}
        disabled={disabled}
      >
        <SelectTrigger className={cn(
          "w-full bg-background/50 border-border text-foreground hover:border-accent/40 focus:ring-accent focus:border-accent transition-colors duration-200",
          disabled && "opacity-50 cursor-not-allowed"
        )}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-glass border-border shadow-gold-glow text-foreground">
          {items.length > 0 ? (
            items.map((item, index) => (
              <SelectItem key={index} value={item.value} className="cursor-pointer hover:bg-muted text-sm">
                {item.content}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="None" disabled className="text-muted-foreground text-sm">
              No data available
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
