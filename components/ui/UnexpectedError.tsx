'use client';

import React from 'react';

import { AlertTriangle, RefreshCw } from 'lucide-react';

const UnexpectedError = () => {
  return (
    <div className="h-header bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-3 rounded-full">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Unexpected Error
        </h1>

        <p className="text-gray-600 mb-6">
          We&apos;ve encountered an unexpected issue and are unable to proceed.
          Our team has been notified and is working to resolve this as quickly
          as possible.
        </p>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>System recovery in progress</span>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200">
            Try Again
          </button>

          <a
            href="#"
            className="block text-indigo-600 hover:text-indigo-700 text-sm">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default UnexpectedError;
