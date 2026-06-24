import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || window.location.origin;

const REGEX_TEMPLATES = [
  {
    category: 'Phone Numbers',
    patterns: [
      { name: 'US Phone (XXX-XXX-XXXX)', regex: '\\d{3}-\\d{3}-\\d{4}', example: '123-456-7890' },
      { name: 'US Phone (XXX) XXX-XXXX', regex: '\\(\\d{3}\\)\\s*\\d{3}-\\d{4}', example: '(123) 456-7890' },
      { name: 'International +X XXX XXX XXXX', regex: '\\+\\d{1,3}\\s\\d{3}\\s\\d{3}\\s\\d{4}', example: '+1 123 456 7890' },
      { name: 'Any 10-digit number', regex: '\\d{10}', example: '1234567890' }
    ]
  },
  {
    category: 'Email Addresses',
    patterns: [
      { name: 'Standard Email', regex: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', example: 'user@example.com' },
      { name: 'Simple Email', regex: '\\S+@\\S+\\.\\S+', example: 'user@domain.com' }
    ]
  },
  {
    category: 'Dates',
    patterns: [
      { name: 'MM/DD/YYYY', regex: '\\d{2}/\\d{2}/\\d{4}', example: '12/31/2024' },
      { name: 'DD-MM-YYYY', regex: '\\d{2}-\\d{2}-\\d{4}', example: '31-12-2024' },
      { name: 'YYYY-MM-DD', regex: '\\d{4}-\\d{2}-\\d{2}', example: '2024-12-31' },
      { name: 'Month DD, YYYY', regex: '[A-Z][a-z]+\\s\\d{1,2},\\s\\d{4}', example: 'December 31, 2024' }
    ]
  },
  {
    category: 'Numbers & Currency',
    patterns: [
      { name: 'Currency $X,XXX.XX', regex: '\\$\\d{1,3}(,\\d{3})*\\.\\d{2}', example: '$1,234.56' },
      { name: 'Currency €X.XXX,XX', regex: '€\\d{1,3}(\\.\\d{3})*(,\\d{2})?', example: '€1.234,56' },
      { name: 'Percentage', regex: '\\d+\\.?\\d*%', example: '25.5%' },
      { name: 'Decimal Numbers', regex: '\\d+\\.\\d+', example: '123.45' },
      { name: 'Whole Numbers', regex: '\\b\\d+\\b', example: '12345' }
    ]
  },
  {
    category: 'Text Patterns',
    patterns: [
      { name: 'Uppercase Words', regex: '\\b[A-Z]{2,}\\b', example: 'NASA' },
      { name: 'Lowercase Words', regex: '\\b[a-z]+\\b', example: 'hello' },
      { name: 'Capitalized Words', regex: '\\b[A-Z][a-z]+\\b', example: 'Hello' },
      { name: 'All Spaces', regex: '\\s+', example: ' ' },
      { name: 'Multiple Spaces', regex: '\\s{2,}', example: '  ' }
    ]
  },
  {
    category: 'IDs & Codes',
    patterns: [
      { name: 'SSN (XXX-XX-XXXX)', regex: '\\d{3}-\\d{2}-\\d{4}', example: '123-45-6789' },
      { name: 'ZIP Code (5 digits)', regex: '\\b\\d{5}\\b', example: '12345' },
      { name: 'ZIP+4 (XXXXX-XXXX)', regex: '\\d{5}-\\d{4}', example: '12345-6789' },
      { name: 'Credit Card', regex: '\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}', example: '1234-5678-9012-3456' },
      { name: 'UUID', regex: '[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}', example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6' }
    ]
  },
  {
    category: 'Web & URLs',
    patterns: [
      { name: 'URL', regex: 'https?://[^\\s]+', example: 'https://example.com' },
      { name: 'Domain Name', regex: '[a-zA-Z0-9-]+\\.[a-zA-Z]{2,}', example: 'example.com' },
      { name: 'IP Address', regex: '\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b', example: '192.168.1.1' }
    ]
  },
  {
    category: 'Custom',
    patterns: [
      { name: 'Custom Pattern', regex: '', example: 'Enter your own regex' }
    ]
  }
];

function App() {
  const [file, setFile] = useState(null);
  const [sheets, setSheets] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [operation, setOperation] = useState('find-replace');
  const [pattern, setPattern] = useState('');
  const [replacement, setReplacement] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadedFilename, setUploadedFilename] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Phone Numbers');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPatternLibrary, setShowPatternLibrary] = useState(true);
  
  // VLOOKUP states
  const [lookupSheet, setLookupSheet] = useState('');
  const [lookupColumn, setLookupColumn] = useState('');
  const [targetSheet, setTargetSheet] = useState('');
  const [targetColumn, setTargetColumn] = useState('');
  const [resultColumn, setResultColumn] = useState('');
  const [matchType, setMatchType] = useState('exact');
  const [lookupColumns, setLookupColumns] = useState([]);
  const [targetColumns, setTargetColumns] = useState([]);

  // Merge Sheets states
  const [leftSheet, setLeftSheet] = useState('');
  const [rightSheet, setRightSheet] = useState('');
  const [leftKey, setLeftKey] = useState('');
  const [rightKey, setRightKey] = useState('');
  const [mergeType, setMergeType] = useState('inner');
  const [leftColumns, setLeftColumns] = useState([]);
  const [rightColumns, setRightColumns] = useState([]);

  // XLOOKUP states
  const [xlookupSheet, setXlookupSheet] = useState('');
  const [xlookupColumn, setXlookupColumn] = useState('');
  const [xlookupTargetSheet, setXlookupTargetSheet] = useState('');
  const [xlookupTargetColumn, setXlookupTargetColumn] = useState('');
  const [xlookupReturnColumns, setXlookupReturnColumns] = useState([]);
  const [xlookupMatchType, setXlookupMatchType] = useState('exact');
  const [xlookupSheetColumns, setXlookupSheetColumns] = useState([]);
  const [xlookupTargetColumns, setXlookupTargetColumns] = useState([]);

  // Reconcile states
  const [reconcileSheet1, setReconcileSheet1] = useState('');
  const [reconcileSheet2, setReconcileSheet2] = useState('');
  const [reconcileKeyColumn, setReconcileKeyColumn] = useState('');
  const [reconcileCompareColumns, setReconcileCompareColumns] = useState([]);
  const [reconcileSheet1Columns, setReconcileSheet1Columns] = useState([]);
  const [reconcileSheet2Columns, setReconcileSheet2Columns] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setPattern(template.regex);
    if (template.regex === '') {
      setShowPatternLibrary(false);
    }
  };

  const getCategoryPatterns = () => {
    const category = REGEX_TEMPLATES.find(cat => cat.category === selectedCategory);
    return category ? category.patterns : [];
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/upload`, formData);
      setSheets(response.data.sheets);
      setUploadedFilename(response.data.filename);
      setResult({ type: 'success', message: response.data.message });
    } catch (error) {
      setResult({ type: 'error', message: error.response?.data?.detail || 'Upload failed' });
    }
    setLoading(false);
  };

  const handleFindReplace = async () => {
    if (!pattern || !uploadedFilename) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/find-replace`, {
        filename: uploadedFilename,
        pattern: pattern,
        replacement: replacement,
        sheet_name: selectedSheet || null,
        case_sensitive: caseSensitive
      });
      setResult({ 
        type: 'success', 
        message: response.data.message,
        downloadFile: response.data.output_file
      });
    } catch (error) {
      setResult({ type: 'error', message: error.response?.data?.detail || 'Operation failed' });
    }
    setLoading(false);
  };

  const handleSheetMatch = async () => {
    if (!pattern || !uploadedFilename) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/sheet-match`, {
        filename: uploadedFilename,
        pattern: pattern
      });
      setResult({ 
        type: 'success', 
        message: `Found ${response.data.total_matches} matching sheets`,
        sheets: response.data.matched_sheets
      });
    } catch (error) {
      setResult({ type: 'error', message: error.response?.data?.detail || 'Operation failed' });
    }
    setLoading(false);
  };

  const handleVLookup = async () => {
    if (!lookupSheet || !lookupColumn || !targetSheet || !targetColumn || !resultColumn) {
      setResult({ type: 'error', message: 'Please fill in all VLOOKUP fields' });
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/vlookup-write`, {
        filename: uploadedFilename,
        lookup_sheet: lookupSheet,
        lookup_column: lookupColumn,
        target_sheet: targetSheet,
        target_column: targetColumn,
        result_column: resultColumn,
        match_type: matchType
      });
      setResult({ 
        type: 'success', 
        message: response.data.message,
        downloadFile: response.data.output_file
      });
    } catch (error) {
      setResult({ type: 'error', message: error.response?.data?.detail || 'VLOOKUP failed' });
    }
    setLoading(false);
  };

  const loadSheetColumns = async (sheetName) => {
    if (!uploadedFilename || !sheetName) return [];
    try {
      const response = await axios.get(`${API_URL}/sheet-columns`, {
        params: {
          filename: uploadedFilename,
          sheet_name: sheetName
        }
      });
      return response.data.columns;
    } catch (error) {
      console.error('Failed to load columns:', error);
      setResult({ type: 'error', message: `Failed to load columns: ${error.response?.data?.detail || error.message}` });
      return [];
    }
  };

  const handleLookupSheetChange = async (sheetName) => {
    setLookupSheet(sheetName);
    setLookupColumn('');
    if (sheetName) {
      const cols = await loadSheetColumns(sheetName);
      setLookupColumns(cols);
    } else {
      setLookupColumns([]);
    }
  };

  const handleTargetSheetChange = async (sheetName) => {
    setTargetSheet(sheetName);
    setTargetColumn('');
    setResultColumn('');
    if (sheetName) {
      const cols = await loadSheetColumns(sheetName);
      setTargetColumns(cols);
    } else {
      setTargetColumns([]);
    }
  };

  const handleLeftSheetChange = async (sheetName) => {
    setLeftSheet(sheetName);
    setLeftKey('');
    if (sheetName) {
      const cols = await loadSheetColumns(sheetName);
      setLeftColumns(cols);
    } else {
      setLeftColumns([]);
    }
  };

  const handleRightSheetChange = async (sheetName) => {
    setRightSheet(sheetName);
    setRightKey('');
    if (sheetName) {
      const cols = await loadSheetColumns(sheetName);
      setRightColumns(cols);
    } else {
      setRightColumns([]);
    }
  };

  const handleXlookupSheetChange = async (sheetName) => {
    setXlookupSheet(sheetName);
    setXlookupColumn('');
    if (sheetName) {
      const cols = await loadSheetColumns(sheetName);
      setXlookupSheetColumns(cols);
    } else {
      setXlookupSheetColumns([]);
    }
  };

  const handleXlookupTargetSheetChange = async (sheetName) => {
    setXlookupTargetSheet(sheetName);
    setXlookupTargetColumn('');
    setXlookupReturnColumns([]);
    if (sheetName) {
      const cols = await loadSheetColumns(sheetName);
      setXlookupTargetColumns(cols);
    } else {
      setXlookupTargetColumns([]);
    }
  };

  const handleReconcileSheet1Change = async (sheetName) => {
    setReconcileSheet1(sheetName);
    setReconcileKeyColumn('');
    setReconcileCompareColumns([]);
    if (sheetName) {
      const cols = await loadSheetColumns(sheetName);
      setReconcileSheet1Columns(cols);
    } else {
      setReconcileSheet1Columns([]);
    }
  };

  const handleReconcileSheet2Change = async (sheetName) => {
    setReconcileSheet2(sheetName);
    if (sheetName) {
      const cols = await loadSheetColumns(sheetName);
      setReconcileSheet2Columns(cols);
    } else {
      setReconcileSheet2Columns([]);
    }
  };

  const handleMergeSheets = async () => {
    if (!leftSheet || !rightSheet || !leftKey || !rightKey) {
      setResult({ type: 'error', message: 'Please fill in all merge fields' });
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/merge-sheets`, {
        filename: uploadedFilename,
        left_sheet: leftSheet,
        right_sheet: rightSheet,
        left_key: leftKey,
        right_key: rightKey,
        merge_type: mergeType
      });
      setResult({ 
        type: 'success', 
        message: response.data.message,
        downloadFile: response.data.output_file
      });
    } catch (error) {
      setResult({ type: 'error', message: error.response?.data?.detail || 'Merge failed' });
    }
    setLoading(false);
  };

  const handleXlookup = async () => {
    if (!xlookupSheet || !xlookupColumn || !xlookupTargetSheet || !xlookupTargetColumn || xlookupReturnColumns.length === 0) {
      setResult({ type: 'error', message: 'Please fill in all XLOOKUP fields' });
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/xlookup`, {
        filename: uploadedFilename,
        lookup_sheet: xlookupSheet,
        lookup_column: xlookupColumn,
        target_sheet: xlookupTargetSheet,
        target_column: xlookupTargetColumn,
        return_columns: xlookupReturnColumns,
        match_type: xlookupMatchType
      });
      setResult({ 
        type: 'success', 
        message: response.data.message,
        downloadFile: response.data.output_file
      });
    } catch (error) {
      setResult({ type: 'error', message: error.response?.data?.detail || 'XLOOKUP failed' });
    }
    setLoading(false);
  };

  const handleReconcile = async () => {
    if (!reconcileSheet1 || !reconcileSheet2 || !reconcileKeyColumn || reconcileCompareColumns.length === 0) {
      setResult({ type: 'error', message: 'Please fill in all reconciliation fields' });
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/reconcile`, {
        filename: uploadedFilename,
        sheet1: reconcileSheet1,
        sheet2: reconcileSheet2,
        key_column: reconcileKeyColumn,
        compare_columns: reconcileCompareColumns
      });
      setResult({ 
        type: 'success', 
        message: `${response.data.message}: ${response.data.total_differences} differences found`,
        downloadFile: response.data.output_file,
        details: {
          only_in_sheet1: response.data.only_in_sheet1,
          only_in_sheet2: response.data.only_in_sheet2,
          mismatches: response.data.mismatches
        }
      });
    } catch (error) {
      setResult({ type: 'error', message: error.response?.data?.detail || 'Reconciliation failed' });
    }
    setLoading(false);
  };

  const toggleReturnColumn = (col) => {
    if (xlookupReturnColumns.includes(col)) {
      setXlookupReturnColumns(xlookupReturnColumns.filter(c => c !== col));
    } else {
      setXlookupReturnColumns([...xlookupReturnColumns, col]);
    }
  };

  const toggleCompareColumn = (col) => {
    if (reconcileCompareColumns.includes(col)) {
      setReconcileCompareColumns(reconcileCompareColumns.filter(c => c !== col));
    } else {
      setReconcileCompareColumns([...reconcileCompareColumns, col]);
    }
  };

  const handleDownload = () => {
    if (result?.downloadFile) {
      window.open(`${API_URL}/download/${result.downloadFile}`, '_blank');
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>📊 Excel Regex Pro</h1>
        <p className="subtitle">Advanced regex operations for Excel files</p>

        <div className="upload-section">
          <input 
            type="file" 
            accept=".xlsx,.xls" 
            onChange={handleFileChange}
            id="file-input"
          />
          <label htmlFor="file-input" className="file-label">
            {file ? file.name : 'Choose Excel file'}
          </label>
          <button onClick={handleUpload} disabled={!file || loading} className="btn-primary">
            Upload
          </button>
        </div>

        {sheets.length > 0 && (
          <div className="operation-section">
            <div className="form-group">
              <label>Operation</label>
              <select value={operation} onChange={(e) => setOperation(e.target.value)}>
                <option value="find-replace">Find & Replace</option>
                <option value="sheet-match">Sheet Matching</option>
                <option value="vlookup">VLOOKUP</option>
                <option value="merge-sheets">Merge Two Sheets</option>
                <option value="xlookup">XLOOKUP (Multiple Columns)</option>
                <option value="reconcile">Reconcile Reports</option>
              </select>
            </div>

            {operation === 'find-replace' && (
              <>
                <div className="form-group">
                  <label>Sheet (optional)</label>
                  <select value={selectedSheet} onChange={(e) => setSelectedSheet(e.target.value)}>
                    <option value="">All Sheets</option>
                    {sheets.map(sheet => (
                      <option key={sheet} value={sheet}>{sheet}</option>
                    ))}
                  </select>
                </div>

                {showPatternLibrary && (
                  <div className="pattern-library">
                    <h3>📚 Pattern Library</h3>
                    <p className="library-subtitle">Select a common pattern or create your own</p>
                    
                    <div className="category-tabs">
                      {REGEX_TEMPLATES.map(category => (
                        <button
                          key={category.category}
                          className={`category-tab ${selectedCategory === category.category ? 'active' : ''}`}
                          onClick={() => setSelectedCategory(category.category)}
                        >
                          {category.category}
                        </button>
                      ))}
                    </div>

                    <div className="pattern-grid">
                      {getCategoryPatterns().map((template, idx) => (
                        <div
                          key={idx}
                          className={`pattern-card ${selectedTemplate === template ? 'selected' : ''}`}
                          onClick={() => handleTemplateSelect(template)}
                        >
                          <div className="pattern-name">{template.name}</div>
                          <div className="pattern-example">Example: {template.example}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label>
                    Pattern {selectedTemplate && <span className="pattern-info">({selectedTemplate.name})</span>}
                    <button 
                      className="toggle-library-btn"
                      onClick={() => setShowPatternLibrary(!showPatternLibrary)}
                    >
                      {showPatternLibrary ? 'Hide Library' : 'Show Library'}
                    </button>
                  </label>
                  <input 
                    type="text" 
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    placeholder="Select from library or enter custom pattern"
                  />
                </div>

                <div className="form-group">
                  <label>Replacement Text</label>
                  <input 
                    type="text" 
                    value={replacement}
                    onChange={(e) => setReplacement(e.target.value)}
                    placeholder="What to replace matches with"
                  />
                </div>

                <div className="form-group checkbox">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={caseSensitive}
                      onChange={(e) => setCaseSensitive(e.target.checked)}
                    />
                    Case Sensitive
                  </label>
                </div>

                <button onClick={handleFindReplace} disabled={loading || !pattern} className="btn-primary">
                  Execute Find & Replace
                </button>
              </>
            )}

            {operation === 'sheet-match' && (
              <>
                <div className="form-group">
                  <label>Sheet Name Pattern</label>
                  <input 
                    type="text" 
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    placeholder="e.g., Report.*2024"
                  />
                </div>

                <button onClick={handleSheetMatch} disabled={loading} className="btn-primary">
                  Find Matching Sheets
                </button>
              </>
            )}

            {operation === 'vlookup' && (
              <>
                <div className="vlookup-section">
                  <h3>🔍 VLOOKUP Configuration</h3>
                  <p className="vlookup-subtitle">Match data between sheets</p>
                  
                  <div className="vlookup-group">
                    <h4>Source (Where to look up)</h4>
                    <div className="form-group">
                      <label>Lookup Sheet</label>
                      <select value={lookupSheet} onChange={(e) => handleLookupSheetChange(e.target.value)}>
                        <option value="">Select sheet...</option>
                        {sheets.map(sheet => (
                          <option key={sheet} value={sheet}>{sheet}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Lookup Column</label>
                      <select value={lookupColumn} onChange={(e) => setLookupColumn(e.target.value)} disabled={!lookupSheet}>
                        <option value="">Select column...</option>
                        {lookupColumns.map(col => (
                          <option key={col} value={col}>{col}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="vlookup-group">
                    <h4>Target (Where to find matches)</h4>
                    <div className="form-group">
                      <label>Target Sheet</label>
                      <select value={targetSheet} onChange={(e) => handleTargetSheetChange(e.target.value)}>
                        <option value="">Select sheet...</option>
                        {sheets.map(sheet => (
                          <option key={sheet} value={sheet}>{sheet}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Match Column</label>
                      <select value={targetColumn} onChange={(e) => setTargetColumn(e.target.value)} disabled={!targetSheet}>
                        <option value="">Select column to match...</option>
                        {targetColumns.map(col => (
                          <option key={col} value={col}>{col}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Return Column</label>
                      <select value={resultColumn} onChange={(e) => setResultColumn(e.target.value)} disabled={!targetSheet}>
                        <option value="">Select column to return...</option>
                        {targetColumns.map(col => (
                          <option key={col} value={col}>{col}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Match Type</label>
                    <select value={matchType} onChange={(e) => setMatchType(e.target.value)}>
                      <option value="exact">Exact Match</option>
                      <option value="contains">Contains</option>
                      <option value="regex">Regex Pattern</option>
                    </select>
                  </div>
                </div>

                <button onClick={handleVLookup} disabled={loading} className="btn-primary">
                  Execute VLOOKUP
                </button>
              </>
            )}

            {operation === 'merge-sheets' && (
              <>
                <div className="vlookup-section">
                  <h3>🔗 Merge Two Sheets</h3>
                  <p className="vlookup-subtitle">Combine data from two sheets based on a common key</p>
                  
                  <div className="vlookup-group">
                    <h4>Left Sheet</h4>
                    <div className="form-group">
                      <label>Sheet Name</label>
                      <select value={leftSheet} onChange={(e) => handleLeftSheetChange(e.target.value)}>
                        <option value="">Select sheet...</option>
                        {sheets.map(sheet => (
                          <option key={sheet} value={sheet}>{sheet}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Key Column</label>
                      <select value={leftKey} onChange={(e) => setLeftKey(e.target.value)} disabled={!leftSheet}>
                        <option value="">Select key column...</option>
                        {leftColumns.map(col => (
                          <option key={col} value={col}>{col}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="vlookup-group">
                    <h4>Right Sheet</h4>
                    <div className="form-group">
                      <label>Sheet Name</label>
                      <select value={rightSheet} onChange={(e) => handleRightSheetChange(e.target.value)}>
                        <option value="">Select sheet...</option>
                        {sheets.map(sheet => (
                          <option key={sheet} value={sheet}>{sheet}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Key Column</label>
                      <select value={rightKey} onChange={(e) => setRightKey(e.target.value)} disabled={!rightSheet}>
                        <option value="">Select key column...</option>
                        {rightColumns.map(col => (
                          <option key={col} value={col}>{col}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Merge Type</label>
                    <select value={mergeType} onChange={(e) => setMergeType(e.target.value)}>
                      <option value="inner">Inner (Only matching rows)</option>
                      <option value="left">Left (All from left sheet)</option>
                      <option value="right">Right (All from right sheet)</option>
                      <option value="outer">Outer (All rows from both)</option>
                    </select>
                  </div>
                </div>

                <button onClick={handleMergeSheets} disabled={loading} className="btn-primary">
                  Merge Sheets
                </button>
              </>
            )}

            {operation === 'xlookup' && (
              <>
                <div className="vlookup-section">
                  <h3>🔎 XLOOKUP (Multiple Columns)</h3>
                  <p className="vlookup-subtitle">Lookup and return multiple columns at once</p>
                  
                  <div className="vlookup-group">
                    <h4>Source Sheet</h4>
                    <div className="form-group">
                      <label>Lookup Sheet</label>
                      <select value={xlookupSheet} onChange={(e) => handleXlookupSheetChange(e.target.value)}>
                        <option value="">Select sheet...</option>
                        {sheets.map(sheet => (
                          <option key={sheet} value={sheet}>{sheet}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Lookup Column</label>
                      <select value={xlookupColumn} onChange={(e) => setXlookupColumn(e.target.value)} disabled={!xlookupSheet}>
                        <option value="">Select column...</option>
                        {xlookupSheetColumns.map(col => (
                          <option key={col} value={col}>{col}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="vlookup-group">
                    <h4>Target Sheet</h4>
                    <div className="form-group">
                      <label>Target Sheet</label>
                      <select value={xlookupTargetSheet} onChange={(e) => handleXlookupTargetSheetChange(e.target.value)}>
                        <option value="">Select sheet...</option>
                        {sheets.map(sheet => (
                          <option key={sheet} value={sheet}>{sheet}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Match Column</label>
                      <select value={xlookupTargetColumn} onChange={(e) => setXlookupTargetColumn(e.target.value)} disabled={!xlookupTargetSheet}>
                        <option value="">Select column to match...</option>
                        {xlookupTargetColumns.map(col => (
                          <option key={col} value={col}>{col}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Return Columns (Select Multiple)</label>
                      <div className="checkbox-grid">
                        {xlookupTargetColumns.map(col => (
                          <label key={col} className="checkbox-label">
                            <input 
                              type="checkbox" 
                              checked={xlookupReturnColumns.includes(col)}
                              onChange={() => toggleReturnColumn(col)}
                            />
                            {col}
                          </label>
                        ))}
                      </div>
                      <p className="help-text">{xlookupReturnColumns.length} columns selected</p>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Match Type</label>
                    <select value={xlookupMatchType} onChange={(e) => setXlookupMatchType(e.target.value)}>
                      <option value="exact">Exact Match</option>
                      <option value="contains">Contains</option>
                      <option value="regex">Regex Pattern</option>
                    </select>
                  </div>
                </div>

                <button onClick={handleXlookup} disabled={loading} className="btn-primary">
                  Execute XLOOKUP
                </button>
              </>
            )}

            {operation === 'reconcile' && (
              <>
                <div className="vlookup-section">
                  <h3>⚖️ Reconcile Reports</h3>
                  <p className="vlookup-subtitle">Compare two sheets and identify differences</p>
                  
                  <div className="vlookup-group">
                    <h4>First Sheet</h4>
                    <div className="form-group">
                      <label>Sheet Name</label>
                      <select value={reconcileSheet1} onChange={(e) => handleReconcileSheet1Change(e.target.value)}>
                        <option value="">Select sheet...</option>
                        {sheets.map(sheet => (
                          <option key={sheet} value={sheet}>{sheet}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="vlookup-group">
                    <h4>Second Sheet</h4>
                    <div className="form-group">
                      <label>Sheet Name</label>
                      <select value={reconcileSheet2} onChange={(e) => handleReconcileSheet2Change(e.target.value)}>
                        <option value="">Select sheet...</option>
                        {sheets.map(sheet => (
                          <option key={sheet} value={sheet}>{sheet}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Key Column (Must exist in both sheets)</label>
                    <select value={reconcileKeyColumn} onChange={(e) => setReconcileKeyColumn(e.target.value)} disabled={!reconcileSheet1 || !reconcileSheet2}>
                      <option value="">Select key column...</option>
                      {reconcileSheet1Columns.filter(col => reconcileSheet2Columns.includes(col)).map(col => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Columns to Compare (Select Multiple)</label>
                    <div className="checkbox-grid">
                      {reconcileSheet1Columns.filter(col => reconcileSheet2Columns.includes(col) && col !== reconcileKeyColumn).map(col => (
                        <label key={col} className="checkbox-label">
                          <input 
                            type="checkbox" 
                            checked={reconcileCompareColumns.includes(col)}
                            onChange={() => toggleCompareColumn(col)}
                          />
                          {col}
                        </label>
                      ))}
                    </div>
                    <p className="help-text">{reconcileCompareColumns.length} columns selected for comparison</p>
                  </div>
                </div>

                <button onClick={handleReconcile} disabled={loading} className="btn-primary">
                  Reconcile Sheets
                </button>
              </>
            )}
          </div>
        )}

        {result && (
          <div className={`result ${result.type}`}>
            <p>{result.message}</p>
            {result.sheets && (
              <ul>
                {result.sheets.map(sheet => <li key={sheet}>{sheet}</li>)}
              </ul>
            )}
            {result.details && (
              <div className="result-details">
                <p>📊 Only in {reconcileSheet1}: {result.details.only_in_sheet1}</p>
                <p>📊 Only in {reconcileSheet2}: {result.details.only_in_sheet2}</p>
                <p>⚠️ Value mismatches: {result.details.mismatches}</p>
              </div>
            )}
            {result.downloadFile && (
              <button onClick={handleDownload} className="btn-download">
                Download Modified File
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
