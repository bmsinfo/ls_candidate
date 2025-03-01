import { CheckCircle, Clock, Mail } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function InterviewAlreadyGiven() {
  return (
    <div className=" h-dvh flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Interview Submitted!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-muted-foreground">
            <p className="mb-4">
              Thank you for completing your interview. Our team will get back to
              you soon after the review.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <span>Review typically takes 3-5 business days</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <span>
                You&apos;ll receive an email notification with our decision
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
