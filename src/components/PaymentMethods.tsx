
import React from 'react';
import { CreditCard, Landmark, Wallet } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PaymentMethodsProps {
  selectedMethod: string;
  onChange: (value: string) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ selectedMethod, onChange }) => {
  return (
    <RadioGroup value={selectedMethod} onValueChange={onChange} className="space-y-3">
      <div className="flex items-center space-x-2 border border-border rounded-md p-3 hover:bg-accent/30 transition-colors cursor-pointer">
        <RadioGroupItem value="card" id="card" />
        <Label 
          htmlFor="card" 
          className="flex flex-1 items-center cursor-pointer"
        >
          <CreditCard className="w-4 h-4 mr-2 text-gray-600" />
          <div>
            <span className="font-medium">Credit/Debit Card</span>
            <p className="text-xs text-gray-500">Pay using Visa, Mastercard, RuPay</p>
          </div>
        </Label>
      </div>
      
      <div className="flex items-center space-x-2 border border-border rounded-md p-3 hover:bg-accent/30 transition-colors cursor-pointer">
        <RadioGroupItem value="bank" id="bank" />
        <Label 
          htmlFor="bank" 
          className="flex flex-1 items-center cursor-pointer"
        >
          <Landmark className="w-4 h-4 mr-2 text-gray-600" />
          <div>
            <span className="font-medium">Net Banking</span>
            <p className="text-xs text-gray-500">Pay directly from your bank account</p>
          </div>
        </Label>
      </div>
      
      <div className="flex items-center space-x-2 border border-border rounded-md p-3 hover:bg-accent/30 transition-colors cursor-pointer">
        <RadioGroupItem value="upi" id="upi" />
        <Label 
          htmlFor="upi" 
          className="flex flex-1 items-center cursor-pointer"
        >
          <Wallet className="w-4 h-4 mr-2 text-gray-600" />
          <div>
            <span className="font-medium">UPI</span>
            <p className="text-xs text-gray-500">Pay using BHIM, Google Pay, PhonePe, Paytm</p>
          </div>
        </Label>
      </div>
    </RadioGroup>
  );
};

export default PaymentMethods;
