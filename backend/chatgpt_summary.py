import os
import json
from typing import Dict, Any, List, Optional
from datetime import datetime
import openai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class ChatGPTSummaryGenerator:
    def __init__(self):
        """Initialize ChatGPT summary generator with OpenAI API key"""
        print(f"[DEBUG] Initializing ChatGPTSummaryGenerator")
        self.api_key = os.getenv('OPEN_AI_KEY')
        print(f"[DEBUG] API key found: {'Yes' if self.api_key else 'No'}")
        if not self.api_key:
            raise ValueError("OPEN_AI_KEY not found in environment variables")
        
        # Configure OpenAI client
        print(f"[DEBUG] Creating OpenAI client")
        self.client = openai.OpenAI(api_key=self.api_key)
        self.model = "gpt-4.1-nano"  # Using gpt-4o-mini as it's a valid model
        print(f"[DEBUG] OpenAI client created successfully, model: {self.model}")
        
    def generate_summary(self, analysis_results: Dict[str, Any]) -> dict:
        """Generate both a full and concise summary using ChatGPT"""
        print(f"[DEBUG] ChatGPTSummaryGenerator.generate_summary called with: {analysis_results}")
        anomalies_found = analysis_results.get('anomalies_found', 0)
        total_records = analysis_results.get('total_records', 0)
        processing_time = analysis_results.get('processing_time', 0)
        anomalies_data = analysis_results.get('anomalies_data', [])
        print(f"[DEBUG] Extracted data - anomalies_found: {anomalies_found}, total_records: {total_records}, processing_time: {processing_time}")
        print(f"[DEBUG] Anomalies data length: {len(anomalies_data)}")
        anomaly_rate = (anomalies_found / total_records * 100) if total_records > 0 else 0
        print(f"[DEBUG] Calculated anomaly_rate: {anomaly_rate}")
        # Prepare the prompt for ChatGPT (full summary)
        prompt = self._create_prompt(anomalies_found, total_records, anomaly_rate, processing_time, anomalies_data)
        print(f"[DEBUG] Created prompt, length: {len(prompt)}")
        # Prepare the prompt for concise summary
        short_prompt = f"In 1-2 sentences, summarize the key findings of this energy data analysis: {anomalies_found} anomalies found out of {total_records} records (anomaly rate: {anomaly_rate:.2f}%). Processing time: {processing_time:.2f} seconds. Focus on actionable insight."
        try:
            print(f"[DEBUG] Making OpenAI API call with model: {self.model}")
            # Full summary
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert energy data analyst specializing in emissions monitoring and anomaly detection. Generate clear, professional, and actionable summaries for energy data analysis reports."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1000,
                temperature=0.7
            )
            full_summary = response.choices[0].message.content.strip()
            print(f"[DEBUG] OpenAI API call for full summary successful, length: {len(full_summary)}")
            # Short summary
            response_short = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert energy data analyst. Write a concise, business-friendly summary for a dashboard card."},
                    {"role": "user", "content": short_prompt}
                ],
                max_tokens=120,
                temperature=0.5
            )
            short_summary = response_short.choices[0].message.content.strip()
            print(f"[DEBUG] OpenAI API call for short summary successful, length: {len(short_summary)}")
            return {"summary_full": full_summary, "summary_short": short_summary}
        except Exception as e:
            print(f"[ERROR] Error generating ChatGPT summary: {e}")
            print(f"[DEBUG] Exception type: {type(e).__name__}")
            import traceback
            print(f"[DEBUG] Full traceback: {traceback.format_exc()}")
            # Fallback to template-based summary
            fallback_full = self._generate_fallback_summary(analysis_results)
            fallback_short = f"Analysis completed for {total_records:,} records. {anomalies_found} anomalies detected ({anomaly_rate:.2f}%)."
            print(f"[DEBUG] Generated fallback summaries, full length: {len(fallback_full)}, short length: {len(fallback_short)}")
            return {"summary_full": fallback_full, "summary_short": fallback_short}
    
    def _create_prompt(self, anomalies_found: int, total_records: int, 
                      anomaly_rate: float, processing_time: float, 
                      anomalies_data: List[Dict]) -> str:
        """Create a detailed prompt for ChatGPT"""
        
        # Prepare anomaly details
        anomaly_details = ""
        if anomalies_data:
            anomaly_details = "\n\n**Anomaly Details:**\n"
            for i, anomaly in enumerate(anomalies_data[:5], 1):  # Limit to first 5
                facility = anomaly.get('facility', 'Unknown')
                year = anomaly.get('year', 'Unknown')
                emission_value = anomaly.get('emission_value', 0)
                severity = anomaly.get('severity', 'Unknown')
                
                anomaly_details += f"{i}. {facility} ({year}) - {emission_value:.2f} units ({severity} severity)\n"
            
            if len(anomalies_data) > 5:
                anomaly_details += f"... and {len(anomalies_data) - 5} additional anomalies\n"
        
        # Create the prompt
        prompt = f"""
Please generate a comprehensive energy data analysis summary based on the following information:

**Analysis Overview:**
- Total Records Processed: {total_records:,}
- Anomalies Detected: {anomalies_found}
- Anomaly Rate: {anomaly_rate:.2f}%
- Processing Time: {processing_time:.2f} seconds

{anomaly_details}

**Requirements:**
1. Write a professional executive summary (2-3 sentences)
2. Provide key findings and insights
3. Include specific recommendations for action
4. Use clear, business-friendly language
5. Focus on actionable insights
6. Keep the total summary under 300 words

**Format the response as:**
# Energy Data Analysis Summary

## Executive Summary
[Your executive summary here]

## Key Findings
[Your key findings here]

## Recommendations
[Your recommendations here]

---
*Generated by Rayfield Systems Energy Analytics Platform using AI*
"""
        
        return prompt
    
    def _generate_fallback_summary(self, analysis_results: Dict[str, Any]) -> str:
        """Generate a fallback summary if ChatGPT fails"""
        
        anomalies_found = analysis_results.get('anomalies_found', 0)
        total_records = analysis_results.get('total_records', 0)
        processing_time = analysis_results.get('processing_time', 0)
        
        anomaly_rate = (anomalies_found / total_records * 100) if total_records > 0 else 0
        
        return f"""
# Energy Data Analysis Summary

## Executive Summary
Analysis completed for {total_records:,} records with {anomalies_found} anomalies detected ({anomaly_rate:.2f}% anomaly rate). Processing completed in {processing_time:.2f} seconds.

## Key Findings
- {'No anomalies detected' if anomalies_found == 0 else f'{anomalies_found} anomalies requiring attention'}
- {'System operating within normal parameters' if anomaly_rate < 1 else 'Operational issues identified' if anomaly_rate < 5 else 'Significant operational concerns detected'}

## Recommendations
- {'Continue current monitoring practices' if anomalies_found == 0 else 'Investigate detected anomalies immediately'}
- Document findings for compliance reporting
- Schedule follow-up analysis within 30 days

---
*Generated by Rayfield Systems Energy Analytics Platform*
"""
    
    def generate_anomaly_explanation(self, anomaly_data: Dict[str, Any]) -> str:
        """Generate detailed explanation for a specific anomaly using ChatGPT"""
        
        facility = anomaly_data.get('facility', 'Unknown')
        year = anomaly_data.get('year', 'Unknown')
        emission_value = anomaly_data.get('emission_value', 0)
        severity = anomaly_data.get('severity', 'Unknown')
        
        prompt = f"""
Please provide a detailed explanation for this energy emissions anomaly:

**Anomaly Details:**
- Facility: {facility}
- Year: {year}
- Emission Value: {emission_value:.2f} units
- Severity: {severity}

Explain:
1. What this anomaly means in practical terms
2. Potential causes for this type of anomaly
3. Recommended immediate actions
4. Long-term considerations

Keep the explanation clear and actionable (under 150 words).
"""
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert energy analyst. Provide clear, actionable explanations for emissions anomalies."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=300,
                temperature=0.6
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"Error generating anomaly explanation: {e}")
            return f"Anomaly detected at {facility} ({year}) with emission value of {emission_value:.2f} units. Severity level: {severity}. Requires investigation."

# Example usage
if __name__ == "__main__":
    try:
        generator = ChatGPTSummaryGenerator()
        
        # Mock data for testing
        mock_results = {
            'anomalies_found': 3,
            'total_records': 1000,
            'processing_time': 2.5,
            'anomalies_data': [
                {
                    'facility': 'Power Plant Alpha',
                    'year': '2024',
                    'emission_value': 2450.67,
                    'severity': 'High',
                    'timestamp': '2025-01-08T21:30:00Z'
                },
                {
                    'facility': 'Energy Station Beta',
                    'year': '2024',
                    'emission_value': 1890.23,
                    'severity': 'Medium',
                    'timestamp': '2025-01-08T21:30:00Z'
                }
            ]
        }
        
        summary_dict = generator.generate_summary(mock_results)
        print("Generated Summary:")
        print("Full Summary:")
        print(summary_dict["summary_full"])
        print("\nShort Summary:")
        print(summary_dict["summary_short"])
        
    except ValueError as e:
        print(f"Configuration error: {e}")
        print("Please ensure OPEN_AI_KEY is set in your .env file")
    except Exception as e:
        print(f"Error: {e}") 