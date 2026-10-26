import React, { useState } from 'react';
import {
  Upload,
  X,
  AlertCircle,
  CheckCircle2,
  FileText,
  RefreshCw,
  Eye,
  Check,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { dsaService } from '../../services/dsa.service.js';

export default function ImportModal({ platform = 'leetcode', isOpen, onClose, onSuccess }) {
  const [importText, setImportText] = useState('');
  const [format, setFormat] = useState('json'); // 'json' | 'csv'
  const [step, setStep] = useState('input'); // 'input' | 'preview'
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState(null);
  const [successFeedback, setSuccessFeedback] = useState(null);

  if (!isOpen) return null;

  const sampleCsvTemplate = `problemId,title,difficulty,category,tags,url
1,Two Sum,Easy,Array,Array;Hash Table,https://leetcode.com/problems/two-sum/
167,Two Sum II - Input Array Is Sorted,Medium,Two Pointers,Array;Two Pointers,https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/
42,Trapping Rain Water,Hard,Two Pointers,Array;Two Pointers;Dynamic Programming,https://leetcode.com/problems/trapping-rain-water/`;

  const sampleJsonTemplate = JSON.stringify(
    [
      {
        platform,
        problemId: platform === 'leetcode' ? '1' : '4A',
        title: platform === 'leetcode' ? 'Two Sum' : 'Watermelon',
        difficulty: platform === 'leetcode' ? 'Easy' : '800',
        category: platform === 'leetcode' ? 'Hashing' : 'Math',
        tags: [platform === 'leetcode' ? 'Array' : 'brute force'],
        problemUrl:
          platform === 'leetcode'
            ? 'https://leetcode.com/problems/two-sum/'
            : 'https://codeforces.com/problemset/problem/4/A',
        summary: 'Find indices of numbers that add up to target.',
        approach: 'Use an unordered map to look up complements in O(1) time.',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        language: 'C++',
        status: 'Solved',
      },
    ],
    null,
    2
  );

  const handleLoadSample = (sampleType) => {
    if (sampleType === 'csv') {
      setFormat('csv');
      setImportText(sampleCsvTemplate);
    } else {
      setFormat('json');
      setImportText(sampleJsonTemplate);
    }
    setErrorFeedback(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isCsv = file.name.endsWith('.csv');
    setFormat(isCsv ? 'csv' : 'json');

    const reader = new FileReader();
    reader.onload = (event) => {
      setImportText(event.target.result || '');
      setErrorFeedback(null);
    };
    reader.onerror = () => {
      setErrorFeedback('Failed to read selected file.');
    };
    reader.readAsText(file);
  };

  // Step 1 -> Step 2: Validate and generate preview
  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!importText.trim() || loading) return;

    setErrorFeedback(null);
    setLoading(true);

    try {
      const res = await dsaService.previewImport(platform, importText.trim());
      if (res?.data) {
        setPreviewData(res.data);
        setStep('preview');
      } else {
        throw new Error('Preview did not return valid data.');
      }
    } catch (err) {
      console.warn('[ImportModal] Preview error:', err);
      setErrorFeedback(err?.response?.data?.message || err.message || 'Validation failed.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2 -> Step 3: Confirm and save to MongoDB
  const handleConfirmImport = async () => {
    if (!previewData || previewData.validCount === 0 || loading) return;

    setLoading(true);
    setErrorFeedback(null);

    try {
      const res = await dsaService.importProblems(importText.trim(), platform);
      setSuccessFeedback(
        res?.message ||
          `Successfully saved ${res?.data?.importedCount || previewData.validCount} problem records!`
      );
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      console.warn('[ImportModal] Import failed:', err);
      setErrorFeedback(err?.response?.data?.message || err.message || 'Import failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel w-full max-w-3xl bg-[#0b1322] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {platform === 'leetcode' ? 'LeetCode' : 'Codeforces'} Full History Import
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {step === 'input'
                  ? 'Step 1 of 2: Upload or paste CSV / JSON export'
                  : 'Step 2 of 2: Review validation, preview duplicates, and confirm'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Transparency Alert */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300 flex items-start gap-2.5 leading-relaxed">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white">Security &amp; Data Integrity:</span> No credentials, passwords, or session cookies are ever requested. Solved problems are safely stored with provenance <code className="text-cyan-300">manual_import</code>, and personal notes/code are protected from overwrite.
          </div>
        </div>

        {/* Error Feedback */}
        {errorFeedback && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold">Validation Notice</p>
              <p className="font-mono text-[11px] leading-relaxed break-all">{errorFeedback}</p>
            </div>
          </div>
        )}

        {/* Success Feedback */}
        {successFeedback && (
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{successFeedback}</span>
          </div>
        )}

        {/* Step 1: Input view */}
        {step === 'input' && (
          <form onSubmit={handleAnalyze} className="space-y-4">
            {/* Format toggle & Sample Loaders */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-400">Format:</span>
                <button
                  type="button"
                  onClick={() => setFormat('json')}
                  className={`px-2.5 py-1 rounded-lg font-mono text-xs border ${
                    format === 'json'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  JSON
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('csv')}
                  className={`px-2.5 py-1 rounded-lg font-mono text-xs border ${
                    format === 'csv'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  CSV
                </button>
              </div>

              <div className="flex items-center gap-2">
                <label className="cursor-pointer px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 font-mono text-xs inline-flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Upload File</span>
                  <input
                    type="file"
                    accept=".json,.csv,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => handleLoadSample(format)}
                  className="text-cyan-400 hover:underline font-mono inline-flex items-center gap-1 text-xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Load {format.toUpperCase()} Sample</span>
                </button>
              </div>
            </div>

            <textarea
              rows="10"
              required
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder={
                format === 'csv'
                  ? sampleCsvTemplate
                  : `[\n  {\n    "problemId": "1",\n    "title": "Two Sum",\n    "difficulty": "Easy"\n  }\n]`
              }
              className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-cyan-300 font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-colors resize-none selection:bg-cyan-500/30"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!importText.trim() || loading}
                className="py-2 px-5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-semibold text-xs transition-all shadow-md inline-flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Input...</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Analyze &amp; Preview Import</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Preview view */}
        {step === 'preview' && previewData && (
          <div className="space-y-5">
            {/* Metric Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center font-mono">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase">Parsed Total</p>
                <p className="text-xl font-bold text-white mt-0.5">{previewData.totalParsed}</p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                <p className="text-[10px] text-emerald-400 uppercase">Ready To Import</p>
                <p className="text-xl font-bold text-emerald-300 mt-0.5">{previewData.validCount}</p>
              </div>

              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/25">
                <p className="text-[10px] text-cyan-400 uppercase">New Problems</p>
                <p className="text-xl font-bold text-cyan-300 mt-0.5">{previewData.newCount}</p>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25">
                <p className="text-[10px] text-amber-400 uppercase">Merge / Update</p>
                <p className="text-xl font-bold text-amber-300 mt-0.5">{previewData.duplicateCount}</p>
              </div>
            </div>

            {/* Rejected Rows Warning */}
            {previewData.rejectedCount > 0 && (
              <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-800/40 text-xs space-y-2">
                <div className="flex items-center gap-2 text-rose-300 font-semibold">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>{previewData.rejectedCount} record(s) omitted due to validation errors</span>
                </div>
                <div className="max-h-24 overflow-y-auto space-y-1 text-[11px] font-mono text-rose-400/90">
                  {previewData.rejectedRows.slice(0, 5).map((r, i) => (
                    <div key={i}>• {r.reason}</div>
                  ))}
                  {previewData.rejectedRows.length > 5 && (
                    <div>...and {previewData.rejectedRows.length - 5} more</div>
                  )}
                </div>
              </div>
            )}

            {/* Preview Table */}
            <div className="rounded-xl border border-slate-800 overflow-hidden text-xs">
              <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800 font-mono text-[11px] text-slate-400 flex items-center justify-between">
                <span>Preview Sample ({previewData.previewItems.length} shown)</span>
                <span className="text-cyan-400 font-semibold">Duplicate Safe: Existing Code Preserved</span>
              </div>
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/60 font-sans">
                {previewData.previewItems.map((item, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between gap-3 hover:bg-slate-900/40">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono text-cyan-400 text-[11px] w-12 truncate font-semibold">
                        #{item.problemId}
                      </span>
                      <span className="text-white font-medium truncate max-w-xs">{item.title}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                        {item.difficulty}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                          item.isDuplicate
                            ? 'bg-amber-500/10 text-amber-300 border border-amber-500/25'
                            : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/25'
                        }`}
                      >
                        {item.isDuplicate ? 'In DB (Update)' : 'New Problem'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep('input')}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white inline-flex items-center gap-1.5 font-mono"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Back to Edit</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmImport}
                disabled={previewData.validCount === 0 || loading}
                className="py-2.5 px-6 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition-all shadow-md inline-flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Writing to MongoDB...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Confirm &amp; Import ({previewData.validCount} Problems)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
