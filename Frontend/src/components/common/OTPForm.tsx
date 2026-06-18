import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react";

function OTPForm({ className, onChange, value }: { className?: string; onChange?: (value: string) => void; value?: string }) {
    const isControlled = value !== undefined;
    const [internalOtp, setInternalOtp] = useState<string>(value ?? "");

    useEffect(() => {
        if (isControlled) setInternalOtp(value ?? "");
    }, [value, isControlled]);

    const handleChange = (val: string) => {
        setInternalOtp(val);
        onChange?.(val);
    };

    const slotClass = "bg-muted/30 border-border text-foreground font-heading font-semibold text-lg transition-all duration-200 focus:border-accent hover:border-accent/30";

    return (
        <div className={cn("flex justify-center", className)}>
            <InputOTP
                maxLength={6}
                className="w-full hover:cursor-pointer"
                pattern={REGEXP_ONLY_DIGITS}
                value={internalOtp}
                onChange={handleChange}
            >
                <InputOTPGroup>
                    <InputOTPSlot index={0} className={slotClass} />
                    <InputOTPSlot index={1} className={slotClass} />
                    <InputOTPSlot index={2} className={slotClass} />
                </InputOTPGroup>
                <InputOTPSeparator className="text-muted-foreground" />
                <InputOTPGroup>
                    <InputOTPSlot index={3} className={slotClass} />
                    <InputOTPSlot index={4} className={slotClass} />
                    <InputOTPSlot index={5} className={slotClass} />
                </InputOTPGroup>
            </InputOTP>
        </div>
    );
}

export default OTPForm;
