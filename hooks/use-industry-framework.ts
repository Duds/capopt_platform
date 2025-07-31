import { useState, useMemo, useCallback } from 'react';

interface OperationalStreamsData {
  industry: string;
  sector: string;
  operationalStreams: string[];
}

interface ComplianceFrameworkData {
  industry: string;
  sector: string;
  complianceRequirements: string[];
  regulatoryFramework: {
    Federal?: string[];
    State?: string[];
    Industry?: string[];
    International?: string[];
  };
}

interface IndustryFrameworkResponse {
  industry: string;
  operationalStreams: OperationalStreamsData[];
  complianceFramework: ComplianceFrameworkData[];
}

export const useIndustryFramework = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [frameworkData, setFrameworkData] = useState<IndustryFrameworkResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get sectors for selected industry
  const sectors = useMemo(() => {
    if (!frameworkData?.operationalStreams) return [];
    return frameworkData.operationalStreams.map(item => item.sector);
  }, [frameworkData?.operationalStreams]);

  // Get operational streams for selected industry and sector
  const operationalStreams = useMemo(() => {
    if (!frameworkData?.operationalStreams || !selectedSector) return [];
    const item = frameworkData.operationalStreams.find(
      item => item.industry === selectedIndustry && item.sector === selectedSector
    );
    return item?.operationalStreams || [];
  }, [frameworkData?.operationalStreams, selectedIndustry, selectedSector]);

  // Get compliance requirements for selected industry and sector
  const complianceRequirements = useMemo(() => {
    if (!frameworkData?.complianceFramework || !selectedSector) return [];
    const item = frameworkData.complianceFramework.find(
      item => item.industry === selectedIndustry && item.sector === selectedSector
    );
    return item?.complianceRequirements || [];
  }, [frameworkData?.complianceFramework, selectedIndustry, selectedSector]);

  // Get regulatory framework for selected industry and sector
  const regulatoryFramework = useMemo(() => {
    if (!frameworkData?.complianceFramework || !selectedSector) return {};
    const item = frameworkData.complianceFramework.find(
      item => item.industry === selectedIndustry && item.sector === selectedSector
    );
    return item?.regulatoryFramework || {};
  }, [frameworkData?.complianceFramework, selectedIndustry, selectedSector]);

  // Fetch framework data for industry
  const fetchFrameworkData = useCallback(async (industry: string) => {
    if (!industry) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/frameworks/industry/${encodeURIComponent(industry)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch framework data');
      }
      
      const data = await response.json();
      setFrameworkData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch framework data');
      console.error('Error fetching framework data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update selected industry and fetch data
  const updateIndustry = useCallback((industry: string) => {
    setSelectedIndustry(industry);
    setSelectedSector(''); // Reset sector when industry changes
    if (industry) {
      fetchFrameworkData(industry);
    } else {
      setFrameworkData(null);
    }
  }, [fetchFrameworkData]);

  // Update selected sector
  const updateSector = useCallback((sector: string) => {
    setSelectedSector(sector);
  }, []);

  // Get all available industries
  const getIndustries = useCallback(async () => {
    try {
      const response = await fetch('/api/frameworks/industries');
      if (!response.ok) {
        throw new Error('Failed to fetch industries');
      }
      const data = await response.json();
      return data.industries;
    } catch (err) {
      console.error('Error fetching industries:', err);
      return [];
    }
  }, []);

  return {
    // State
    selectedIndustry,
    selectedSector,
    frameworkData,
    loading,
    error,
    
    // Computed values
    sectors,
    operationalStreams,
    complianceRequirements,
    regulatoryFramework,
    
    // Actions
    updateIndustry,
    updateSector,
    fetchFrameworkData,
    getIndustries
  };
}; 