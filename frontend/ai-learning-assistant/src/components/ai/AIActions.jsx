import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import aiService from '../../services/aiService';
import toast from 'react-hot-toast';
import { BookOpen, Sparkles } from 'lucide-react';

const AIActions = () => {
    const {id: documentId} = useParams();
    const [loadingAction, setLoadingAction] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [concept, setConcept] = useState("");

    const handleGenerateSummary = async () => {
        setLoadingAction("summary");
        try {
            const {summary} = await aiService.generateSummary(documentId);
            setModalTitle("Generated Summary");
            setModalContent(summary);
            setIsModalOpen(true);
        } catch (error) {
            toast.error("Failed to generate summary");
            console.error("Error generating summary:", error);
        } finally {
            setLoadingAction(null);
        }
    }

    const handleExplainConcept = async (e) =>{
        e.preventDefault();
        if(!concept.trim()) {
            toast.error("Please enter a concept to explain");
            return;
        }
        setLoadingAction("explain");
        try {
            const {explanation} = await aiService.explainConcept(documentId, concept);
            setModalTitle(`Explanation of ${concept}`);
            setModalContent(explanation);
            setIsModalOpen(true);
            setConcept("");
        } catch (error) {
            toast.error("Failed to explain concept");
            console.error("Error explaining concept:", error);
        } finally {
            setLoadingAction(null);
        }
    }

  return (
    <>
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6 border-b border-slate-200/60 bg-linear-to-br from-slate-50/50 to-white/50">
            <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-purple-500/25 flex items-center justify-center">
                    <Sparkles className='size-5 text-white' strokeWidth={2} />
                </div>
                <div className="text-lg font-semibold text-slate-900">
                    <h3 className="text-xs text-slate-500">AI Assistant</h3>
                    <p className="">Powered by advanced AI</p>
                </div>
            </div>
        </div>
        <div className="p-6 space-y-6">
            {/* Generate Summary */}
            <div className="group p-5 bg-linear-to-br from-slate-50/50 to-white rounded-xl border border-slate-200/60 hover:border-slate-300/60 hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="size-8 rounded-lg bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                                <BookOpen className='size-4 text-blue-600' strokeWidth={2} />
                            </div>
                            <h4 className="font-semibold text-slate-900">Generate Summary</h4>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Get a concise summary of the entire documents.
                        </p>
                    </div>
                    <button onClick={handleGenerateSummary} disabled={loadingAction === "summary"} className="shrink-0 h-10 px-5  bg-linear-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95">
                        {loadingAction === "summary" ? (
                            <span className='flex items-center gap-2'>
                                <div className='animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white' />
                                Loading...
                            </span>
                        ) : (
                            "Summarize"
                        )}
                    </button>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default AIActions