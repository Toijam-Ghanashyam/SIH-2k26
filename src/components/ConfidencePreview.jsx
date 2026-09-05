import React from 'react';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const ConfidencePreview = () => {
  const parcels = [
    { id: "P-1042", source: "Drone + Cadastral", status: "High", color: "bg-green-500", bg: "bg-green-50", border: "border-green-200", icon: <CheckCircle className="text-green-600" size={18} /> },
    { id: "P-1043", source: "Drone Only", status: "Medium", color: "bg-amber-500", bg: "bg-amber-50", border: "border-amber-200", icon: <Clock className="text-amber-600" size={18} /> },
    { id: "P-1044", source: "Municipal + Drone", status: "High", color: "bg-green-500", bg: "bg-green-50", border: "border-green-200", icon: <CheckCircle className="text-green-600" size={18} /> },
    { id: "P-1045", source: "Cadastral Conflict", status: "Low", color: "bg-red-500", bg: "bg-red-50", border: "border-red-200", icon: <AlertTriangle className="text-red-600" size={18} /> },
    { id: "P-1046", source: "GNSS + Municipal", status: "Medium", color: "bg-amber-500", bg: "bg-amber-50", border: "border-amber-200", icon: <Clock className="text-amber-600" size={18} /> },
    { id: "P-1047", source: "Drone + GT", status: "High", color: "bg-green-500", bg: "bg-green-50", border: "border-green-200", icon: <CheckCircle className="text-green-600" size={18} /> },
  ];

  return (
    <section className="py-20 bg-slate-50 border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div>
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Confidence & Trust Preview</h2>
            <p className="text-lg text-slate-600 mb-8">
              The system assigns a dynamic confidence score to every integrated output, enabling a smart human-in-the-loop review workflow.
            </p>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 mr-4 border border-green-200">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                </div>
                <div>
                  <h4 className="font-semibold text-navy-900">High Confidence</h4>
                  <p className="text-sm text-slate-600">Sources agree. Automated approval and sync with land records.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mr-4 border border-amber-200">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                </div>
                <div>
                  <h4 className="font-semibold text-navy-900">Medium Confidence</h4>
                  <p className="text-sm text-slate-600">Minor mismatches or old data. Routed to review queue.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0 mr-4 border border-red-200">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                </div>
                <div>
                  <h4 className="font-semibold text-navy-900">Low Confidence / High Impact</h4>
                  <p className="text-sm text-slate-600">Major conflicts or overlaps. Mandatory manual verification required.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-100">
              <h3 className="font-semibold text-sm sm:text-base text-navy-800">Recent Parcel Integrations</h3>
              <span className="text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">Live View</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {parcels.map((parcel, index) => (
                <div key={index} className={`p-4 rounded-lg border ${parcel.border} ${parcel.bg} flex justify-between items-start`}>
                  <div>
                    <span className="font-mono text-sm font-bold text-navy-900">{parcel.id}</span>
                    <p className="text-xs text-slate-600 mt-1">{parcel.source}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    {parcel.icon}
                    <span className={`text-[10px] uppercase font-bold mt-2 ${parcel.status === 'High' ? 'text-green-700' : parcel.status === 'Medium' ? 'text-amber-700' : 'text-red-700'}`}>
                      {parcel.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ConfidencePreview;
