import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Building, Info } from 'lucide-react';
import { toast } from 'react-toastify';

interface BankingDetailsProps {
  className?: string;
  showTitle?: boolean;
  variant?: 'card' | 'alert' | 'minimal';
}

const BankingDetails: React.FC<BankingDetailsProps> = ({ 
  className = '', 
  showTitle = true, 
  variant = 'card' 
}) => {
  const bankingInfo = {
    institution: 'H.I.T - BANKING DETAILS',
    bank: 'CBZ BANK',
    accountType: '(USD NOSTRO ACCOUNT)',
    branch: 'INSTITUTIONAL BANKING',
    accountNumber: '10720583120213'
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copied to clipboard!`);
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });
  };

  const BankingContent = () => (
    <div className="space-y-3">
      <div className="text-center">
        <h4 className="font-semibold text-lg text-blue-700 mb-1">{bankingInfo.institution}</h4>
        <p className="font-medium text-gray-800">{bankingInfo.bank}</p>
        <p className="text-sm text-gray-600">{bankingInfo.accountType}</p>
      </div>
      
      <div className="border-t pt-3 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Branch:</span>
          <span className="text-sm text-gray-900">{bankingInfo.branch}</span>
        </div>
        
        <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
          <div>
            <span className="text-sm font-medium text-gray-700">Account Number:</span>
            <div className="text-lg font-mono font-bold text-blue-700">{bankingInfo.accountNumber}</div>
          </div>
          <button
            onClick={() => copyToClipboard(bankingInfo.accountNumber, 'Account number')}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title="Copy account number"
          >
            <Copy className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-xs">
          Please use this account number for all residence payment transfers. Include your registration number in the payment reference.
        </AlertDescription>
      </Alert>
    </div>
  );

  if (variant === 'minimal') {
    return (
      <div className={className}>
        <BankingContent />
      </div>
    );
  }

  if (variant === 'alert') {
    return (
      <Alert className={`border-blue-200 bg-blue-50 ${className}`}>
        <Building className="h-4 w-4 text-blue-600" />
        <div className="ml-2">
          {showTitle && (
            <h3 className="font-semibold text-blue-800 mb-2">Banking Details for Payment</h3>
          )}
          <BankingContent />
        </div>
      </Alert>
    );
  }

  return (
    <Card className={`border-blue-200 ${className}`}>
      {showTitle && (
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Building className="w-5 h-5" />
            Banking Details for Payment
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={showTitle ? 'pt-0' : ''}>
        <BankingContent />
      </CardContent>
    </Card>
  );
};

export default BankingDetails;
