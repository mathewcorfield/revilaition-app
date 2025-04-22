import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; 
import ProtectedRoute from '@/components/ProtectedRoute'; 
import { getRevisionQuestion } from '../services/openaiService'; // Service to fetch OpenAI revision questions

const DashboardPage: React.FC = () => {
  const [subjects, setSubjects] = useState<string[]>([]); // List of subjects
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null); // Current subject
  const [subtopics, setSubtopics] = useState<string[]>([]); // Subtopics for the selected subject
  const [userData, setUserData] = useState<any>(null); // To hold user data

  // Life milestones data (can be dynamic or static)
  const lifeMilestones = ['Start A-levels', 'Complete GCSEs', 'Graduate University'];
  
const getCurrentUser = async () => {
  const user = supabase.auth.user();
  if (user) {
    console.log('Current user:', user);
  } else {
    console.log('No user is signed in');
  }
};
  
  useEffect(() => {
    // Fetch the user profile data from Supabase (subject list, etc.)
    const fetchUserData = async () => {
      const { data, error } = await supabase.from('users').select('*').eq('user_id', Id).single();
      if (error) {
        console.error('Error fetching user data:', error.message);
        return;
      }
      if (!data) {
  console.log('No user found');
  return;
}
      setUserData(data);
      setSubjects(data?.subjects || []); // Assuming `subjects` is an array in user data
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      // Fetch the subtopics for the selected subject (this can be customized to your needs)
      const fetchSubtopics = async () => {
        const { data, error } = await supabase
          .from('subtopics')
          .select('*')
          .eq('subject', selectedSubject);

        if (error) {
          console.error('Error fetching subtopics:', error.message);
          return;
        }
        setSubtopics(data || []);
      };
      fetchSubtopics();
    }
  }, [selectedSubject]);

  const handleGenerateRevisionQuestion = async (subtopic: string) => {
    try {
      const question = await getRevisionQuestion(subtopic); // Call OpenAI API service to get revision question
      alert(`Revision Question: ${question}`); // Display or handle the revision question
    } catch (error) {
      console.error('Error generating revision question:', error);
      alert('Failed to generate revision question.');
    }
  };

  return (
    <ProtectedRoute>
      <div className="dashboard-container">
        {/* Life Milestones Bar */}
        <div className="milestones-bar">
          <h3>Life Milestones</h3>
          <div className="milestones">
            {lifeMilestones.map((milestone, index) => (
              <div key={index} className="milestone-item">
                <p>{milestone}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Hub */}
        <div className="learning-hub">
          <div className="left-sidebar">
            <h3>Learning Hub</h3>
            <div className="tab-group">
              <div className="tab" onClick={() => setSelectedSubject('biology')}>Subjects</div>
              <div className="tab">Personality</div>
              <div className="tab">Motivation</div>
            </div>

            {/* Subject List */}
            <div className="subject-list">
              {subjects.map((subject, index) => (
                <div
                  key={index}
                  className="subject-item"
                  onClick={() => setSelectedSubject(subject)}
                >
                  {subject}
                </div>
              ))}
            </div>
          </div>

          {/* Right Content (Timeline & Subtopics) */}
          <div className="right-content">
            {/* Timeline */}
            <div className="timeline">
              <h3>Timeline</h3>
              {/* This could be a calendar/timeline component */}
              <p>Placeholder for a chronological timeline</p>
            </div>

            {/* Show Subtopics for the Selected Subject */}
            {selectedSubject && (
              <div className="subtopics-section">
                <h3>Subtopics for {selectedSubject}</h3>
                <div className="subtopics-list">
                  {subtopics.map((subtopic, index) => (
                    <div key={index} className="subtopic-item">
                      <div className="subtopic-info">
                        <p>{subtopic}</p>
                        <p>Learnt: 0%</p> {/* Placeholder for "learnt" metric */}
                        <p>Revised: 0%</p> {/* Placeholder for "revised" metric */}
                      </div>
                      <button onClick={() => handleGenerateRevisionQuestion(subtopic)}>
                        Generate Revision Question
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
