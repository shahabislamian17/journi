'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { experiencesAPI } from '../../../../../../lib/api';

export default function ExperienceForm({ initialExperience = null, categories = [], isEditMode = false, user = null }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Overview');
  const formInitializedRef = useRef(false);
  
  // Default activity and availability slot for new experiences
  const defaultActivity = { title: '', duration: '', description: '' };
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];
  const defaultAvailabilitySlot = {
    date: defaultDate,
    startTime: '10:00',
    endTime: '14:00',
    price: 100,
    maxGuests: 10,
    available: true
  };
  
  // Initialize with defaults if not in edit mode
  const getInitialActivities = () => {
    if (initialExperience?.itinerary) {
      const parsed = typeof initialExperience.itinerary === 'string' 
        ? JSON.parse(initialExperience.itinerary) 
        : initialExperience.itinerary;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [];
    }
    // New experience: start with one default activity
    return [defaultActivity];
  };
  
  const getInitialAvailabilitySlots = () => {
    if (initialExperience?.availabilitySlots && initialExperience.availabilitySlots.length > 0) {
      return initialExperience.availabilitySlots.map(slot => ({
        date: slot.date ? new Date(slot.date).toISOString().split('T')[0] : '',
        startTime: slot.startTime || '',
        endTime: slot.endTime || '',
        price: slot.price || '',
        maxGuests: slot.maxGuests || 10,
        available: slot.available !== false
      }));
    }
    // New experience: start with one default availability slot
    return [defaultAvailabilitySlot];
  };
  
  const [formData, setFormData] = useState({
    title: initialExperience?.title || '',
    destination: initialExperience?.location || '',
    categoryId: initialExperience?.categoryId || '',
    description: initialExperience?.description || '',
    postalCode: initialExperience?.postalCode || '',
    latitude: initialExperience?.latitude || '',
    longitude: initialExperience?.longitude || '',
    food: initialExperience?.includedItems ? (typeof initialExperience.includedItems === 'string' ? JSON.parse(initialExperience.includedItems)?.food : initialExperience.includedItems?.food) || '' : '',
    drink: initialExperience?.includedItems ? (typeof initialExperience.includedItems === 'string' ? JSON.parse(initialExperience.includedItems)?.drink : initialExperience.includedItems?.drink) || '' : '',
    equipment: initialExperience?.includedItems ? (typeof initialExperience.includedItems === 'string' ? JSON.parse(initialExperience.includedItems)?.equipment : initialExperience.includedItems?.equipment) || '' : '',
    requirements: initialExperience?.requirements || '',
    accessibility: initialExperience?.accessibility || '',
    'meeting-location': initialExperience?.meetingLocation || '',
    'meeting-description': initialExperience?.meetingDescription || '',
    activities: getInitialActivities(),
    'departure-location': initialExperience?.departureLocation || '',
    'departure-description': initialExperience?.departureDescription || '',
    availabilitySlots: getInitialAvailabilitySlots(),
  });
  const [images, setImages] = useState(initialExperience?.images ? initialExperience.images.map(img => ({ url: img.original, id: img.id })) : []);
  const [uploadingImages, setUploadingImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Use a ref to store the latest formData to avoid stale closures in handleSubmit
  const formDataRef = useRef(formData);
  
  // Update ref whenever formData changes
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  useEffect(() => {
    // Initialize form from initialExperience if provided (edit mode)
    // Only initialize once to prevent overwriting user changes
    if (initialExperience && !formInitializedRef.current) {
      formInitializedRef.current = true;
      
      // Get activities: use existing or default to one empty activity
      const existingActivities = initialExperience.itinerary 
        ? (typeof initialExperience.itinerary === 'string' 
            ? JSON.parse(initialExperience.itinerary) 
            : initialExperience.itinerary)
        : null;
      const activitiesToUse = (Array.isArray(existingActivities) && existingActivities.length > 0) 
        ? existingActivities 
        : [defaultActivity];
      
      // Get availability slots: use existing or default to one slot
      const existingSlots = initialExperience.availabilitySlots && initialExperience.availabilitySlots.length > 0
        ? initialExperience.availabilitySlots.map(slot => ({
            date: slot.date ? new Date(slot.date).toISOString().split('T')[0] : '',
            startTime: slot.startTime || '',
            endTime: slot.endTime || '',
            price: slot.price || '',
            maxGuests: slot.maxGuests || 10,
            available: slot.available !== false
          }))
        : [defaultAvailabilitySlot];
      
      setFormData({
        title: initialExperience.title || '',
        destination: initialExperience.location || '',
        categoryId: initialExperience.categoryId || '',
        description: initialExperience.description || '',
        postalCode: initialExperience.postalCode || '',
        latitude: initialExperience.latitude || '',
        longitude: initialExperience.longitude || '',
        food: initialExperience.includedItems ? (typeof initialExperience.includedItems === 'string' ? JSON.parse(initialExperience.includedItems)?.food : initialExperience.includedItems?.food) || '' : '',
        drink: initialExperience.includedItems ? (typeof initialExperience.includedItems === 'string' ? JSON.parse(initialExperience.includedItems)?.drink : initialExperience.includedItems?.drink) || '' : '',
        equipment: initialExperience.includedItems ? (typeof initialExperience.includedItems === 'string' ? JSON.parse(initialExperience.includedItems)?.equipment : initialExperience.includedItems?.equipment) || '' : '',
        requirements: initialExperience.requirements || '',
        accessibility: initialExperience.accessibility || '',
        'meeting-location': initialExperience.meetingLocation || '',
        'meeting-description': initialExperience.meetingDescription || '',
        activities: activitiesToUse,
        'departure-location': initialExperience.departureLocation || '',
        'departure-description': initialExperience.departureDescription || '',
        availabilitySlots: existingSlots,
      });

      // Initialize images from initialExperience
      if (initialExperience.images && initialExperience.images.length > 0) {
        setImages(initialExperience.images.map(img => ({ 
          url: img.original || img.large || img.medium || '', 
          id: img.id 
        })));
      }
    } else if (typeof window !== 'undefined' && window.__API_EXPERIENCE__) {
      // Initialize form from window data if available (fallback)
      const exp = window.__API_EXPERIENCE__;
      
      // Get activities: use existing or default to one empty activity
      const existingActivities = exp.itinerary 
        ? (typeof exp.itinerary === 'string' 
            ? JSON.parse(exp.itinerary) 
            : exp.itinerary)
        : null;
      const activitiesToUse = (Array.isArray(existingActivities) && existingActivities.length > 0) 
        ? existingActivities 
        : [defaultActivity];
      
      // Get availability slots: use existing or default to one slot
      const existingSlots = exp.availabilitySlots && exp.availabilitySlots.length > 0
        ? exp.availabilitySlots.map(slot => ({
            date: slot.date ? new Date(slot.date).toISOString().split('T')[0] : '',
            startTime: slot.startTime || '',
            endTime: slot.endTime || '',
            price: slot.price || '',
            maxGuests: slot.maxGuests || 10,
            available: slot.available !== false
          }))
        : [defaultAvailabilitySlot];
      
      setFormData({
        title: exp.title || '',
        destination: exp.location || '',
        categoryId: exp.categoryId || '',
        description: exp.description || '',
        postalCode: exp.postalCode || '',
        latitude: exp.latitude || '',
        longitude: exp.longitude || '',
        food: exp.includedItems ? (typeof exp.includedItems === 'string' ? JSON.parse(exp.includedItems)?.food : exp.includedItems?.food) || '' : '',
        drink: exp.includedItems ? (typeof exp.includedItems === 'string' ? JSON.parse(exp.includedItems)?.drink : exp.includedItems?.drink) || '' : '',
        equipment: exp.includedItems ? (typeof exp.includedItems === 'string' ? JSON.parse(exp.includedItems)?.equipment : exp.includedItems?.equipment) || '' : '',
        requirements: exp.requirements || '',
        accessibility: exp.accessibility || '',
        'meeting-location': exp.meetingLocation || '',
        'meeting-description': exp.meetingDescription || '',
        activities: activitiesToUse,
        'departure-location': exp.departureLocation || '',
        'departure-description': exp.departureDescription || '',
        availabilitySlots: existingSlots,
      });

      // Initialize images from window data
      if (exp.images && exp.images.length > 0) {
        setImages(exp.images.map(img => ({ 
          url: img.original || img.large || img.medium || '', 
          id: img.id 
        })));
      }
    }
  }, [initialExperience]);

  // Tab navigation and form handling - matches HTML JavaScript exactly
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize tabs on mount
    const initializeTabs = () => {
      const tabs = document.querySelector('.section.three .form .tabs');
      if (!tabs) return;
      
      const allTabs = Array.from(tabs.children);
      allTabs.forEach((tab) => {
        const tabName = tab.getAttribute('data-tab');
        if (tabName === activeTab) {
          tab.setAttribute('data-visibility', '1');
          tab.setAttribute('data-transform', '2');
        } else {
          tab.setAttribute('data-visibility', '0');
          tab.setAttribute('data-transform', '1');
        }
      });
    };

    // Initialize on mount
    setTimeout(initializeTabs, 0);

    // Tab Navigation
    const handleTabClick = (e) => {
      var nav = e.target.closest('.section.two .links li[data-link]');
      var next = e.target.closest('.button.medium[data-button="1A"]');
      var sections;
      var tabs;
      var all;
      var current;
      var target;
      var name;
      var fromIndex;
      var toIndex;
      var forward;

      if (nav) {
        e.preventDefault();
        if (nav.classList.contains('active')) {
          return;
        }
        sections = nav.closest('.sections');
        tabs = sections ? sections.querySelector('.section.three .form .tabs') : null;
        name = nav.getAttribute('data-link');
        target = tabs ? tabs.querySelector('.tab[data-tab=\'' + name + '\']') : null;
        
        if (!tabs || !target) {
          return;
        }

        // Update active tab state
        setActiveTab(name);

        // Animation logic
        all = Array.from(tabs.children);
        current = all.find(function(t) {
          return t.getAttribute('data-visibility') === '1';
        });
        fromIndex = current ? all.indexOf(current) : -1;
        toIndex = all.indexOf(target);
        forward = toIndex > fromIndex;

        target.setAttribute('data-transform', forward ? '1' : '3');
        target.setAttribute('data-visibility', '1');
        target.offsetHeight;

        if (current && current !== target) {
          current.setAttribute('data-transform', forward ? '3' : '1');
          current.offsetHeight;
          setTimeout(function() {
            current.setAttribute('data-visibility', '0');
            current.setAttribute('data-transform', '1');
          }, 600);
        }

        setTimeout(function() {
          requestAnimationFrame(function() {
            target.setAttribute('data-transform', '2');
          });
        }, 450);

        all.forEach(function(t) {
          if (t !== target && t !== current) {
            t.setAttribute('data-visibility', '0');
            t.setAttribute('data-transform', '1');
          }
        });

        if (sections) {
          Array.from(sections.querySelectorAll('.section.two .links li[data-link]')).forEach(function(li) {
            li.classList.toggle('active', li.getAttribute('data-link') === name);
          });
        }
      } else if (next) {
        e.preventDefault();
        if (document.activeElement && document.activeElement.blur) {
          document.activeElement.blur();
        }
        tabs = next.closest('.tabs');
        sections = tabs ? tabs.closest('.sections') : null;
        all = tabs ? Array.from(tabs.children) : [];
        current = all.find(function(t) {
          return t.getAttribute('data-visibility') === '1';
        });
        target = current ? all[all.indexOf(current) + 1] : null;
        name = target ? target.getAttribute('data-tab') : '';
        
        if (!tabs || !target) {
          if (!name) {
            // Last tab - submit form
            handleSubmit(e);
          }
          return;
        }

        // Update active tab state
        setActiveTab(name);

        // Animation logic
        fromIndex = all.indexOf(current);
        toIndex = all.indexOf(target);
        forward = toIndex > fromIndex;

        target.setAttribute('data-transform', forward ? '1' : '3');
        target.setAttribute('data-visibility', '1');
        target.offsetHeight;

        if (current && current !== target) {
          current.setAttribute('data-transform', forward ? '3' : '1');
          current.offsetHeight;
          setTimeout(function() {
            current.setAttribute('data-visibility', '0');
            current.setAttribute('data-transform', '1');
          }, 600);
        }

        setTimeout(function() {
          requestAnimationFrame(function() {
            target.setAttribute('data-transform', '2');
          });
        }, 450);

        all.forEach(function(t) {
          if (t !== target && t !== current) {
            t.setAttribute('data-visibility', '0');
            t.setAttribute('data-transform', '1');
          }
        });

        if (sections) {
          Array.from(sections.querySelectorAll('.section.two .links li[data-link]')).forEach(function(li) {
            li.classList.toggle('active', li.getAttribute('data-link') === name);
          });
        }

        var anchor = document.querySelector('a[name=\'experience\']');
        if (anchor) {
          anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        return;
      }
    };

    document.addEventListener('click', handleTabClick);

    // Form Input Focus Handling
    const inputs = document.querySelectorAll('.input input, .textarea textarea, .select select');
    inputs.forEach(function(input) {
      input.addEventListener('focus', function() {
        input.parentElement.dataset.input = 'focus';
      });

      input.addEventListener('blur', function() {
        if (input.value.trim() !== '') {
          input.parentElement.dataset.input = 'focus';
        } else {
          input.parentElement.dataset.input = '';
        }
      });

      if (input.value.trim() !== '') {
        input.parentElement.dataset.input = 'focus';
      }
    });

    // Character Counter for inputs and textareas with maxlength
    document.querySelectorAll('input[maxlength], textarea[maxlength]').forEach(function(field) {
      var label = field.parentElement.querySelector('label');
      if (!label) return;

      var counterSpan = label.querySelector('span:nth-child(2)');
      if (!counterSpan) return;

      var maxLength = parseInt(field.getAttribute('maxlength'));
      var counterText = counterSpan.textContent.match(/\d+/);
      if (!counterText) return;

      function updateCounter() {
        var length = field.value.length;
        counterSpan.innerHTML = length + '<span>/</span>' + maxLength + ' Characters';
      }

      field.addEventListener('input', updateCounter);
      field.addEventListener('keyup', updateCounter);
      updateCounter(); // Initialize
    });

    return () => {
      document.removeEventListener('click', handleTabClick);
    };
  }, [activeTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    
    // Update character counter immediately
    if (e.target.maxLength && e.target.parentElement) {
      const label = e.target.parentElement.querySelector('label');
      if (label) {
        const counterSpan = label.querySelector('span:nth-child(2)');
        if (counterSpan) {
          const maxLength = parseInt(e.target.getAttribute('maxlength'));
          const length = value.length;
          counterSpan.innerHTML = length + '<span>/</span>' + maxLength + ' Characters';
        }
      }
    }
  };

  const handleInputFocus = (e) => {
    e.target.parentElement.dataset.input = 'focus';
  };

  const handleInputBlur = (e) => {
    if (e.target.value.trim() !== '') {
      e.target.parentElement.dataset.input = 'focus';
    } else {
      e.target.parentElement.dataset.input = '';
    }
  };

  const updateCharacterCounter = (field) => {
    const label = field.parentElement.querySelector('label');
    if (!label) return;
    
    const counterSpan = label.querySelector('span:nth-child(2)');
    if (!counterSpan) return;
    
    const maxLength = parseInt(field.getAttribute('maxlength'));
    const length = field.value.length;
    counterSpan.innerHTML = length + '<span>/</span>' + maxLength + ' Characters';
  };

  const addActivity = () => {
    setFormData(prev => ({
      ...prev,
      activities: [...prev.activities, { title: '', duration: '', description: '' }]
    }));
  };

  const removeActivity = (index) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index)
    }));
  };

  const updateActivity = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.map((activity, i) => 
        i === index ? { ...activity, [field]: value } : activity
      )
    }));
  };

  const addAvailabilitySlot = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultDate = tomorrow.toISOString().split('T')[0];
    
    setFormData(prev => ({
      ...prev,
      availabilitySlots: [...prev.availabilitySlots, {
        date: defaultDate,
        startTime: '10:00',
        endTime: '14:00',
        price: 100,
        maxGuests: 10,
        available: true
      }]
    }));
  };

  const removeAvailabilitySlot = (index, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('Removing availability slot at index:', index);
    setFormData(prev => {
      const newSlots = prev.availabilitySlots.filter((_, i) => i !== index);
      console.log('Availability slots after removal:', newSlots.length);
      return {
        ...prev,
        availabilitySlots: newSlots
      };
    });
  };

  const updateAvailabilitySlot = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      availabilitySlots: prev.availabilitySlots.map((slot, i) => {
        if (i === index) {
          if (field === 'available') {
            return { ...slot, [field]: value };
          } else if (field === 'maxGuests' || field === 'price') {
            return { ...slot, [field]: value === '' ? 0 : parseFloat(value) || 0 };
          } else {
            return { ...slot, [field]: value };
          }
        }
        return slot;
      })
    }));
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    console.log(`Selected ${files.length} file(s) for upload`);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to upload images');
      return;
    }

    setUploadingImages(prev => [...prev, ...files.map(f => f.name)]);

    try {
      const uploadPromises = files.map(async (file, fileIndex) => {
        console.log(`Uploading file ${fileIndex + 1}/${files.length}: ${file.name}`);
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/upload/image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const data = await response.json();
        console.log(`Successfully uploaded file ${fileIndex + 1}: ${data.url}`);
        return { url: data.url, filename: data.filename };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      console.log(`All ${uploadedImages.length} images uploaded successfully`);
      
      // Add uploaded images
      setImages(prev => {
        const updated = [...prev, ...uploadedImages];
        console.log(`Total images in state: ${updated.length}`);
        return updated;
      });
      setUploadingImages([]);
      
      // Reset file input
      e.target.value = '';
    } catch (error) {
      console.error('Error uploading images:', error);
      setError(`Failed to upload images: ${error.message}`);
      setUploadingImages([]);
    }
  };

  const removeImage = async (index) => {
    const imageToRemove = images[index];
    
    // If it's an existing image (has an ID), delete it from the database
    if (imageToRemove?.id && isEditMode && initialExperience?.id) {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/experiences/${initialExperience.id}/images/${imageToRemove.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!response.ok) {
            console.error('Failed to delete image from database');
            // Continue to remove from UI anyway
          }
        }
      } catch (error) {
        console.error('Error deleting image:', error);
        // Continue to remove from UI anyway
      }
    }
    
    // Remove from state
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removePreview = (index) => {
    const preview = previewImages[index];
    if (preview && preview.isPreview) {
      URL.revokeObjectURL(preview.url);
    }
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setUploadingImages(prev => {
      const newUploading = [...prev];
      newUploading.splice(index, 1);
      return newUploading;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Get the latest formData state from ref to avoid stale closures
      // The ref always has the latest state value
      const currentFormData = formDataRef.current;

      // Validate required fields
      if (!currentFormData.title || !currentFormData.categoryId || !currentFormData.destination) {
        setError('Please fill in all required fields (Title, Category, Destination)');
        setIsSubmitting(false);
        return;
      }

      // Generate slug from title
      const slug = currentFormData.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Calculate duration from activities
      let totalHours = 0;
      currentFormData.activities.forEach(activity => {
        if (activity.duration) {
          const match = activity.duration.match(/(\d+(?:\.\d+)?)/);
          if (match) {
            totalHours += parseFloat(match[1]);
          }
        }
      });
      
      // Build itinerary array with meeting point, activities, and departure point
      const itineraryArray = [];
      
      // Add meeting point if provided
      if (currentFormData['meeting-location'] || currentFormData['meeting-description']) {
        itineraryArray.push({
          type: 'meetingPoint',
          location: (currentFormData['meeting-location'] && typeof currentFormData['meeting-location'] === 'string') ? currentFormData['meeting-location'].trim() : '',
          description: (currentFormData['meeting-description'] && typeof currentFormData['meeting-description'] === 'string') ? currentFormData['meeting-description'].trim() : ''
        });
      }
      
      // Add activities
      currentFormData.activities.forEach(activity => {
        if (activity && (activity.title || activity.duration || activity.description)) {
          itineraryArray.push({
            type: 'activity',
            title: (activity.title && typeof activity.title === 'string') ? activity.title.trim() : '',
            duration: activity.duration || '',
            description: (activity.description && typeof activity.description === 'string') ? activity.description.trim() : ''
          });
        }
      });
      
      // Add departure point if provided
      if (currentFormData['departure-location'] || currentFormData['departure-description']) {
        itineraryArray.push({
          type: 'departurePoint',
          location: (currentFormData['departure-location'] && typeof currentFormData['departure-location'] === 'string') ? currentFormData['departure-location'].trim() : '',
          description: (currentFormData['departure-description'] && typeof currentFormData['departure-description'] === 'string') ? currentFormData['departure-description'].trim() : ''
        });
      }
      
      // Prepare availability slots for API
      // IMPORTANT: Get the latest formData state to avoid stale closures
      // In edit mode: send exactly what's in formData (even if empty) - backend will delete all if empty
      // In create mode: use form data or create dummy slots
      let availabilitySlotsToSend = [];
      
      // Get current availability slots from currentFormData (latest state)
      const currentAvailabilitySlots = currentFormData.availabilitySlots || [];
      
      if (isEditMode) {
        // EDIT MODE: Never create dummy slots, always use formData (even if empty)
        if (Array.isArray(currentAvailabilitySlots) && currentAvailabilitySlots.length > 0) {
          availabilitySlotsToSend = currentAvailabilitySlots
            .filter(slot => slot && slot.date) // Only include slots with a date
            .map(slot => ({
              date: slot.date,
              startTime: slot.startTime || null,
              endTime: slot.endTime || null,
              price: slot.price ? parseFloat(slot.price) : 100,
              maxGuests: slot.maxGuests ? parseInt(slot.maxGuests) : 10,
              available: slot.available !== false
            }));
        }
        // If currentAvailabilitySlots is empty, availabilitySlotsToSend stays as []
        console.log('[ExperienceForm] Edit mode - using formData slots:', {
          currentSlotsLength: currentAvailabilitySlots.length,
          currentFormDataSlotsLength: currentFormData.availabilitySlots?.length || 0,
          slotsToSendLength: availabilitySlotsToSend.length,
          currentSlots: currentAvailabilitySlots
        });
      } else {
        // CREATE MODE: Use form data if available, otherwise create dummy slots
        if (formData.availabilitySlots && Array.isArray(formData.availabilitySlots) && formData.availabilitySlots.length > 0) {
          availabilitySlotsToSend = formData.availabilitySlots
            .filter(slot => slot && slot.date)
            .map(slot => ({
              date: slot.date,
              startTime: slot.startTime || null,
              endTime: slot.endTime || null,
              price: slot.price ? parseFloat(slot.price) : 100,
              maxGuests: slot.maxGuests ? parseInt(slot.maxGuests) : 10,
              available: slot.available !== false
            }));
        }
        
        // Only create dummy slots for NEW experiences if no slots provided
        if (availabilitySlotsToSend.length === 0) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          for (let i = 0; i < 30; i++) {
            const slotDate = new Date(today);
            slotDate.setDate(today.getDate() + i);
            availabilitySlotsToSend.push({
              date: slotDate.toISOString().split('T')[0],
              startTime: '10:00',
              endTime: totalHours > 0 ? `${10 + Math.floor(totalHours)}:00` : '14:00',
              price: 100,
              maxGuests: 10,
              available: true
            });
          }
        }
      }
      
      // Prepare data for API
      // Always include availabilitySlots field, even if empty array (for edit mode to delete all slots)
      const experienceData = {
        title: currentFormData.title.trim(),
        slug: isEditMode ? (initialExperience?.slug || slug) : slug,
        description: currentFormData.description.trim() || null,
        categoryId: currentFormData.categoryId,
        location: currentFormData.destination.trim() || null,
        latitude: currentFormData.latitude ? parseFloat(currentFormData.latitude) : null,
        longitude: currentFormData.longitude ? parseFloat(currentFormData.longitude) : null,
        includedItems: JSON.stringify({
          food: currentFormData.food.trim() || null,
          drink: currentFormData.drink.trim() || null,
          equipment: currentFormData.equipment.trim() || null
        }),
        requirements: currentFormData.requirements.trim() || null,
        accessibility: currentFormData.accessibility.trim() || null,
        itinerary: itineraryArray.length > 0 ? JSON.stringify(itineraryArray) : null,
        price: initialExperience?.price || 100, // Use existing price or default to 100
        duration: totalHours > 0 ? (totalHours === 1 ? '1 Hour' : `${totalHours} Hours`) : null,
        hours: totalHours > 0 ? totalHours : null,
        availabilitySlots: availabilitySlotsToSend // Always include, even if empty array
      };

      console.log('[ExperienceForm] Sending availability slots:', {
        isEditMode,
        currentFormDataSlotsCount: currentFormData.availabilitySlots?.length || 0,
        slotsToSendCount: availabilitySlotsToSend.length,
        slots: availabilitySlotsToSend,
        experienceDataKeys: Object.keys(experienceData),
        hasAvailabilitySlotsInData: 'availabilitySlots' in experienceData,
        experienceDataAvailabilitySlots: experienceData.availabilitySlots?.length || 0
      });
      
      // Ensure availabilitySlots is always included in the request for edit mode
      if (isEditMode && !('availabilitySlots' in experienceData)) {
        experienceData.availabilitySlots = [];
        console.log('[ExperienceForm] Added empty availabilitySlots array for edit mode');
      }

      // Get token
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to save experiences');
        setIsSubmitting(false);
        return;
      }

      // Save experience
      let savedExperience;
      if (isEditMode && initialExperience?.id) {
        const response = await experiencesAPI.update(initialExperience.id, experienceData, { token });
        savedExperience = response?.experience;
      } else {
        const response = await experiencesAPI.create(experienceData, { token });
        savedExperience = response?.experience;
      }

      // Save only NEW images to database (images without an id are new)
      const newImages = images.filter(image => !image.id);
      if (newImages.length > 0 && savedExperience?.id) {
        try {
          console.log(`Saving ${newImages.length} new images to experience ${savedExperience.id}`);
          
          // Create experience images - use Promise.allSettled to ensure all images are processed even if one fails
          const imagePromises = newImages.map((image, index) => {
            // Find the index of this new image in the full images array to determine order
            const fullIndex = images.findIndex(img => img === image);
            return fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/experiences/${savedExperience.id}/images`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                original: image.url,
                isPrimary: fullIndex === 0 && !images[0]?.id, // First image is primary only if it's new
                order: fullIndex
              })
            }).then(async (response) => {
              if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                throw new Error(`Failed to save image ${index + 1}: ${errorData.error || response.statusText}`);
              }
              return response.json();
            }).catch((error) => {
              console.error(`Error saving image ${index + 1}:`, error);
              throw error;
            });
          });
          
          const results = await Promise.allSettled(imagePromises);
          
          // Log results
          const successful = results.filter(r => r.status === 'fulfilled').length;
          const failed = results.filter(r => r.status === 'rejected').length;
          console.log(`Image save results: ${successful} successful, ${failed} failed`);
          
          if (failed > 0) {
            results.forEach((result, index) => {
              if (result.status === 'rejected') {
                console.error(`Failed to save image ${index + 1}:`, result.reason);
              }
            });
          }
        } catch (error) {
          console.error('Error saving images:', error);
          // Don't fail the whole submission if images fail
        }
      } else if (isEditMode && images.length > 0) {
        console.log(`Edit mode: ${images.length} images total, ${images.filter(img => img.id).length} existing, ${images.filter(img => !img.id).length} new`);
      }

      // Redirect to experiences list
      router.push('/account/experiences');
    } catch (error) {
      console.error('Error saving experience:', error);
      setError(error.message || 'Failed to save experience. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <a className="anchor" data-anchor="1" name="experience"></a>
      
      <div className="content">
        <div className="sections">
          {/* Section One: Title */}
          <div className="section one">
            <div className="blocks" data-blocks="1">
              <div className="block" data-block="1">
                <div className="title">
                  <h1 className="three">
                    <span className="one">Experience</span>
                    <span className="two">{isEditMode ? 'Edit' : 'New'}</span>
                  </h1>
                </div>
              </div>
            </div>
          </div>

          {/* Section Two: Navigation Tabs */}
          <div className="section two">
            <div className="blocks" data-blocks="1">
              <div className="block" data-block="1">
                <div className="links">
                  <ul>
                    <li className={activeTab === 'Overview' ? 'active' : ''} data-link="Overview">
                      <div className="blocks" data-blocks="2">
                        <div className="block" data-block="1A">
                          <div className="icons">
                            <div className="icon" data-icon="1">
                              <i className="icons8 icons8-pass"></i>
                            </div>
                            <div className="icon" data-icon="2">
                              <i className="icons8 icons8-pass-2"></i>
                            </div>
                          </div>
                        </div>
                        <div className="block" data-block="1B">
                          <div className="title">
                            <h3 className="seven">Overview</h3>
                          </div>
                        </div>
                      </div>
                    </li>

                    <li className={activeTab === 'Itinerary' ? 'active' : ''} data-link="Itinerary">
                      <div className="blocks" data-blocks="2">
                        <div className="block" data-block="1A">
                          <div className="icons">
                            <div className="icon" data-icon="1">
                              <i className="icons8 icons8-map-pinpoint"></i>
                            </div>
                            <div className="icon" data-icon="2">
                              <i className="icons8 icons8-map-pinpoint-2"></i>
                            </div>
                          </div>
                        </div>
                        <div className="block" data-block="1B">
                          <div className="title">
                            <h3 className="seven">Itinerary</h3>
                          </div>
                        </div>
                      </div>
                    </li>

                    <li className={activeTab === 'Availability' ? 'active' : ''} data-link="Availability">
                      <div className="blocks" data-blocks="2">
                        <div className="block" data-block="1A">
                          <div className="icons">
                            <div className="icon" data-icon="1">
                              <i className="icons8 icons8-schedule"></i>
                            </div>
                            <div className="icon" data-icon="2">
                              <i className="icons8 icons8-schedule-2"></i>
                            </div>
                          </div>
                        </div>
                        <div className="block" data-block="1B">
                          <div className="title">
                            <h3 className="seven">Availability</h3>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Section Three: Form */}
          <div className="section three">
            <div className="blocks" data-blocks="1">
              <div className="block" data-block="1">
                <form className="form" onSubmit={handleSubmit}>
                  {error && (
                    <div className="error" style={{ padding: '15px', marginBottom: '20px', background: '#fee', color: '#c33', borderRadius: '4px' }}>
                      {error}
                    </div>
                  )}

                  <div className="tabs">
                    {/* Overview Tab */}
                    <div 
                      className="tab" 
                      data-tab="Overview" 
                      data-transform={activeTab === 'Overview' ? '2' : '1'} 
                      data-visibility={activeTab === 'Overview' ? '1' : '0'}
                    >
                      <div className="fields">
                        {/* Introduction Fieldset */}
                        <div className="fieldset" data-fieldset="1">
                          <div className="blocks" data-blocks="2">
                            <div className="block" data-block="1A">
                              <div className="title">
                                <h2 className="four">Introduction</h2>
                              </div>
                            </div>

                            <div className="block" data-block="1B">
                              <div className="blocks" data-blocks="3">
                                <div className="block" data-block="1BA" data-inputs="1">
                                  <div className="input">
                                    <label>
                                      <span>Title</span>
                                      <span>{formData.title.length}<span>/</span>75 Characters</span>
                                    </label>
                                    <input 
                                      type="text" 
                                      name="title" 
                                      maxLength={75}
                                      value={formData.title}
                                      onChange={handleChange}
                                      onFocus={handleInputFocus}
                                      onBlur={handleInputBlur}
                                    />
                                  </div>
                                </div>

                                <div className="block" data-block="1BB" data-inputs="2">
                                  <div className="select">
                                    <label>
                                      <span>Destination</span>
                                    </label>
                                    <select name="destination" value={formData.destination} onChange={handleChange}>
                                      <option value=""></option>
                                      <option value="Ibiza">Ibiza</option>
                                      <option value="Madrid">Madrid</option>
                                      <option value="Barcelona">Barcelona</option>
                                      <option value="Seville">Seville</option>
                                      <option value="Mallorca">Mallorca</option>
                                    </select>
                                  </div>

                                  <div className="select">
                                    <label>
                                      <span>Category</span>
                                    </label>
                                    <select name="categoryId" value={formData.categoryId} onChange={handleChange}>
                                      <option value=""></option>
                                      {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

                                <div className="block" data-block="1BC" data-inputs="1">
                                  <div className="textarea">
                                    <label>
                                      <span>Description</span>
                                      <span>{formData.description.length}<span>/</span>150 Characters</span>
                                    </label>
                                    <textarea 
                                      name="description" 
                                      rows={3} 
                                      maxLength={150}
                                      value={formData.description}
                                      onChange={handleChange}
                                      onFocus={handleInputFocus}
                                      onBlur={handleInputBlur}
                                    ></textarea>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Images Fieldset */}
                        <div className="fieldset" data-fieldset="1">
                          <div className="blocks" data-blocks="2">
                            <div className="block" data-block="1A">
                              <div className="title">
                                <h2 className="four">Images</h2>
                              </div>
                            </div>

                            <div className="block" data-block="1B">
                              <div className="blocks" data-blocks="3">
                              <div  className="block" data-block="1BA" data-inputs="5">

                                {/* Display uploaded images */}
                                {images.map((image, index) => {
                                  // Images are stored in public folder, so use relative path or frontend URL
                                  let imageSrc = image.url;
                                  if (!image.url.startsWith('http') && !image.url.startsWith('/')) {
                                    // If it's a relative path without leading slash, add it
                                    imageSrc = `/${image.url}`;
                                  } else if (!image.url.startsWith('http') && image.url.startsWith('/assets/')) {
                                    // Relative path from public folder - use as-is (Next.js serves from public)
                                    imageSrc = image.url;
                                  } else if (!image.url.startsWith('http')) {
                                    // Fallback: use relative path
                                    imageSrc = image.url.startsWith('/') ? image.url : `/${image.url}`;
                                  }
                                  
                                  return (
                                      <div key={`uploaded-${index}`} className="upload" style={{ position: 'relative' }}>
                                        <img 
                                          src={imageSrc}
                                          alt={`Experience ${index + 1}`}
                                          className="uploaded-image"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => removeImage(index)}>
                                          ×
                                        </button>
                                      </div>
                                  );
                                })}

                                {/* Display preview images (while uploading) */}
                                {previewImages.map((preview, index) => {
                                  // Ensure we're using the blob URL for preview
                                  const previewSrc = preview.isPreview && preview.url.startsWith('blob:') 
                                    ? preview.url 
                                    : preview.url;
                                  
                                  return (
                                      <div key={`preview-${index}`} className="upload" style={{ position: 'relative' }}>
                                        <img 
                                          src={previewSrc}
                                          alt={`Preview ${index + 1}`}
                                          onError={(e) => {
                                            console.error('Preview image failed to load:', previewSrc, preview);
                                            e.target.style.display = 'none';
                                          }}
                                          onLoad={() => {
                                            console.log('Preview image loaded successfully:', previewSrc);
                                          }}
                                         
                                        />
                                        <button
                                          type="button"
                                          onClick={() => removePreview(index)}>
                                          ×
                                        </button>
                                        {uploadingImages.length > 0 && (
                                          <div>
                                            Uploading...
                                          </div>
                                        )}
                                      </div>
                                  );
                                })}

                                {/* Upload button - always show in horizontal row */}
                                  <div className="upload">
                                    <div className="icon">+</div>
                                    <input 
                                      type="file" 
                                      name="image" 
                                      accept="image/*" 
                                      multiple 
                                      onChange={handleImageChange}
                                      disabled={uploadingImages.length > 0}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Location Fieldset */}
                        <div className="fieldset" data-fieldset="2">
                          <div className="blocks" data-blocks="2">
                            <div className="block" data-block="1A">
                              <div className="title">
                                <h2 className="four">Location</h2>
                              </div>
                            </div>

                            <div className="block" data-block="1B">
                              <div className="blocks" data-blocks="3">
                                <div className="block" data-block="1BA" data-inputs="1">
                                  <div className="input">
                                    <label>
                                      <span>Postal Code</span>
                                    </label>
                                    <input 
                                      type="text" 
                                      name="postalCode"
                                      value={formData.postalCode}
                                      onChange={handleChange}
                                      onFocus={handleInputFocus}
                                      onBlur={handleInputBlur}
                                    />
                                  </div>
                                </div>

                                <div className="blocks" data-block="1BB" data-inputs="1">
                                  <div className="map"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* What's Included Fieldset */}
                        <div className="fieldset" data-fieldset="3">
                          <div className="blocks" data-blocks="2">
                            <div className="block" data-block="1A">
                              <div className="title">
                                <h2 className="four">What's Included</h2>
                              </div>
                            </div>

                            <div className="block" data-block="1B">
                              <div className="blocks" data-blocks="3">
                                <div className="block" data-block="2BA" data-inputs="1">
                                  <div className="textarea">
                                    <label>
                                      <span>Food</span>
                                      <span>{formData.food.length}<span>/</span>100 Characters</span>
                                    </label>
                                    <textarea 
                                      name="food" 
                                      rows={3} 
                                      maxLength={100}
                                      value={formData.food}
                                      onChange={handleChange}
                                      onFocus={handleInputFocus}
                                      onBlur={handleInputBlur}
                                    ></textarea>
                                  </div>
                                </div>

                                <div className="block" data-block="2BA" data-inputs="1">
                                  <div className="textarea">
                                    <label>
                                      <span>Drink</span>
                                      <span>{formData.drink.length}<span>/</span>100 Characters</span>
                                    </label>
                                    <textarea 
                                      name="drink" 
                                      rows={3} 
                                      maxLength={100}
                                      value={formData.drink}
                                      onChange={handleChange}
                                      onFocus={handleInputFocus}
                                      onBlur={handleInputBlur}
                                    ></textarea>
                                  </div>
                                </div>

                                <div className="block" data-block="2BA" data-inputs="1">
                                  <div className="textarea">
                                    <label>
                                      <span>Equipment</span>
                                      <span>{formData.equipment.length}<span>/</span>100 Characters</span>
                                    </label>
                                    <textarea 
                                      name="equipment" 
                                      rows={3} 
                                      maxLength={100}
                                      value={formData.equipment}
                                      onChange={handleChange}
                                      onFocus={handleInputFocus}
                                      onBlur={handleInputBlur}
                                    ></textarea>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Information Fieldset */}
                        <div className="fieldset" data-fieldset="4">
                          <div className="blocks" data-blocks="2">
                            <div className="block" data-block="1A">
                              <div className="title">
                                <h2 className="four">Information</h2>
                              </div>
                            </div>

                            <div className="block" data-block="1B">
                              <div className="blocks" data-blocks="3">
                                <div className="block" data-block="2BA" data-inputs="1">
                                  <div className="textarea">
                                    <label>
                                      <span>Requirements</span>
                                      <span>{formData.requirements.length}<span>/</span>100 Characters</span>
                                    </label>
                                    <textarea 
                                      name="requirements" 
                                      rows={3} 
                                      maxLength={100}
                                      value={formData.requirements}
                                      onChange={handleChange}
                                      onFocus={handleInputFocus}
                                      onBlur={handleInputBlur}
                                    ></textarea>
                                  </div>
                                </div>

                                <div className="block" data-block="2BA" data-inputs="1">
                                  <div className="textarea">
                                    <label>
                                      <span>Accessibility</span>
                                      <span>{formData.accessibility.length}<span>/</span>100 Characters</span>
                                    </label>
                                    <textarea 
                                      name="accessibility" 
                                      rows={3} 
                                      maxLength={100}
                                      value={formData.accessibility}
                                      onChange={handleChange}
                                      onFocus={handleInputFocus}
                                      onBlur={handleInputBlur}
                                    ></textarea>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="block" data-block="1C">
                              <div className="buttons">
                                <div className="button medium" data-button="1A">
                                  <a className="action" href="#">
                                    <div className="text">Next</div>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Itinerary Tab */}
                    <div 
                      className="tab" 
                      data-tab="Itinerary" 
                      data-transform={activeTab === 'Itinerary' ? '2' : '1'} 
                      data-visibility={activeTab === 'Itinerary' ? '1' : '0'}
                    >
                      <div className="fields">
                        {/* Meeting Point Fieldset */}
                        <div className="fieldset" data-fieldset="1">
                          <div className="blocks" data-blocks="2">
                            <div className="block" data-block="1A">
                              <div className="title">
                                <h2 className="four">Meeting Point</h2>
                              </div>
                            </div>

                            <div className="block" data-block="1B">
                              <div className="blocks" data-blocks="3">
                                <div className="block" data-block="1BA" data-inputs="1">
                                  <div className="input">
                                    <label>
                                      <span>Location</span>
                                      <span>{formData['meeting-location'].length}<span>/</span>25 Characters</span>
                                    </label>
                                    <input 
                                      type="text" 
                                      name="meeting-location" 
                                      maxLength={25}
                                      value={formData['meeting-location']}
                                      onChange={handleChange}
                                      onFocus={handleInputFocus}
                                      onBlur={handleInputBlur}
                                    />
                                  </div>
                                </div>

                                <div className="block" data-block="1BB" data-inputs="1">
                                  <div className="textarea">
                                    <label>
                                      <span>Description</span>
                                      <span>{formData['meeting-description'].length}<span>/</span>150 Characters</span>
                                    </label>
                                    <textarea 
                                      name="meeting-description" 
                                      rows={3} 
                                      maxLength={150}
                                      value={formData['meeting-description']}
                                      onChange={handleChange}
                                      onFocus={handleInputFocus}
                                      onBlur={handleInputBlur}
                                    ></textarea>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Activities Fieldset */}
                        <div className="fieldset" data-fieldset="2">
                          <div className="blocks" data-blocks="2">
                            <div className="block" data-block="1A">
                              <div className="title">
                                <h2 className="four">Activities</h2>
                              </div>
                            </div>

                            <div className="block" data-block="1B">
                              <div className="blocks" data-blocks="3">
                                {formData.activities.map((activity, index) => (
                                  <div key={index} className="block" data-block="1BA">
                                    <div className="blocks" data-blocks="4">
                                      <div className="block" data-block="1BAA" data-inputs="2">
                                        <div className="input">
                                          <label>
                                            <span>Title</span>
                                            <span>{activity.title?.length || 0}<span>/</span>25 Characters</span>
                                          </label>
                                          <input 
                                            type="text" 
                                            maxLength={25}
                                            value={activity.title || ''}
                                            onChange={(e) => updateActivity(index, 'title', e.target.value)}
                                            onFocus={handleInputFocus}
                                            onBlur={handleInputBlur}
                                          />
                                        </div>

                                        <div className="select">
                                          <label>
                                            <span>Duration</span>
                                          </label>
                                          <select 
                                            value={activity.duration || ''}
                                            onChange={(e) => updateActivity(index, 'duration', e.target.value)}
                                          >
                                            <option value=""></option>
                                            <option value="15 Minutes">15 Minutes</option>
                                            <option value="30 Minutes">30 Minutes</option>
                                            <option value="45 Minutes">45 Minutes</option>
                                            <option value="1 Hour">1 Hour</option>
                                            <option value="1.5 Hours">1½ Hours</option>
                                            <option value="2 Hours">2 Hours</option>
                                            <option value="2.5 Hours">2½ Hours</option>
                                            <option value="3 Hours">3 Hours</option>
                                            <option value="3.5 Hours">3½ Hours</option>
                                            <option value="4 Hours">4 Hours</option>
                                            <option value="4.5 Hours">4½ Hours</option>
                                            <option value="5 Hours">5 Hours</option>
                                            <option value="5.5 Hours">5½ Hours</option>
                                            <option value="6 Hours">6 Hours</option>
                                            <option value="6.5 Hours">6½ Hours</option>
                                            <option value="7 Hours">7 Hours</option>
                                            <option value="7.5 Hours">7½ Hours</option>
                                            <option value="8 Hours">8 Hours</option>
                                          </select>
                                        </div>
                                      </div>

                                      <div className="block" data-block="1BAB" data-inputs="1">
                                        <div className="textarea">
                                          <label>
                                            <span>Description</span>
                                            <span>{activity.description?.length || 0}<span>/</span>150 Characters</span>
                                          </label>
                                          <textarea 
                                            rows={3} 
                                            maxLength={150}
                                            value={activity.description || ''}
                                            onChange={(e) => updateActivity(index, 'description', e.target.value)}
                                            onFocus={handleInputFocus}
                                            onBlur={handleInputBlur}
                                          ></textarea>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="buttons" style={{ marginTop: '10px' }}>
                                      <div className="button small" onClick={() => removeActivity(index)} style={{ cursor: 'pointer' }}>
                                        <div className="action">
                                          <div className="text">Remove</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}

                                <div className="block" data-block="1C">
                                  <div className="buttons">
                                    <div className="button small" data-button="1A" onClick={addActivity} style={{ cursor: 'pointer' }}>
                                      <div className="action">
                                        <div className="text">Add Activity</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Departure Point Fieldset */}
                            <div className="fieldset" data-fieldset="3">
                              <div className="blocks" data-blocks="2">
                                <div className="block" data-block="1A">
                                  <div className="title">
                                    <h2 className="four">Departure Point</h2>
                                  </div>
                                </div>

                                <div className="block" data-block="1B">
                                  <div className="blocks" data-blocks="3">
                                    <div className="block" data-block="1BA" data-inputs="1">
                                      <div className="input">
                                        <label>
                                          <span>Location</span>
                                          <span>{formData['departure-location'].length}<span>/</span>25 Characters</span>
                                        </label>
                                        <input 
                                          type="text" 
                                          name="departure-location" 
                                          maxLength={25}
                                          value={formData['departure-location']}
                                          onChange={handleChange}
                                          onFocus={handleInputFocus}
                                          onBlur={handleInputBlur}
                                        />
                                      </div>
                                    </div>

                                    <div className="block" data-block="1BB" data-inputs="1">
                                      <div className="textarea">
                                        <label>
                                          <span>Description</span>
                                          <span>{formData['departure-description'].length}<span>/</span>150 Characters</span>
                                        </label>
                                        <textarea 
                                          name="departure-description" 
                                          rows={3} 
                                          maxLength={150}
                                          value={formData['departure-description']}
                                          onChange={handleChange}
                                          onFocus={handleInputFocus}
                                          onBlur={handleInputBlur}
                                        ></textarea>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="block" data-block="1C">
                                  <div className="buttons">
                                    <div className="button medium" data-button="1A">
                                      <div className="action">
                                        <div className="text">Next</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Availability Tab */}
                    <div 
                      className="tab" 
                      data-tab="Availability" 
                      data-transform={activeTab === 'Availability' ? '2' : '1'} 
                      data-visibility={activeTab === 'Availability' ? '1' : '0'}
                    >
                      <div className="fields">
                        <div className="fieldset" data-fieldset="1">
                          <div className="blocks" data-blocks="2">
                            <div className="block" data-block="1A">
                              <div className="title">
                                <h2 className="four">Availability Slots</h2>
                              </div>
                            </div>

                            <div className="block" data-block="1B">
                              {formData.availabilitySlots.length === 0 ? (
                                <div className="text">
                                  <p className="small four">No availability slots added yet. Click "Add Availability Slot" to create one.</p>
                                </div>
                              ) : (
                                <div className="blocks" data-blocks="3">
                                  {formData.availabilitySlots.map((slot, index) => (
                                  <div key={index} className="block" data-block="1BA">
                                    <div className="blocks" data-blocks="4">
                                      <div className="block" data-block="1BAA" data-inputs="3">
                                        <div className="input">
                                          <label>
                                            <span>Date</span>
                                          </label>
                                          <input
                                            type="date"
                                            value={slot.date}
                                            onChange={(e) => updateAvailabilitySlot(index, 'date', e.target.value)}
                                            onFocus={handleInputFocus}
                                            onBlur={handleInputBlur}
                                            min={new Date().toISOString().split('T')[0]}
                                          />
                                        </div>

                                        <div className="input">
                                          <label>
                                            <span>Start Time</span>
                                          </label>
                                          <input
                                            type="time"
                                            value={slot.startTime}
                                            onChange={(e) => updateAvailabilitySlot(index, 'startTime', e.target.value)}
                                            onFocus={handleInputFocus}
                                            onBlur={handleInputBlur}
                                          />
                                        </div>

                                        <div className="input">
                                          <label>
                                            <span>End Time</span>
                                          </label>
                                          <input
                                            type="time"
                                            value={slot.endTime}
                                            onChange={(e) => updateAvailabilitySlot(index, 'endTime', e.target.value)}
                                            onFocus={handleInputFocus}
                                            onBlur={handleInputBlur}
                                          />
                                        </div>
                                      </div>

                                      <div className="block" data-block="1BAB" data-inputs="3">
                                        <div className="input">
                                          <label>
                                            <span>Price (€)</span>
                                          </label>
                                          <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={slot.price}
                                            onChange={(e) => updateAvailabilitySlot(index, 'price', e.target.value)}
                                            onFocus={handleInputFocus}
                                            onBlur={handleInputBlur}
                                          />
                                        </div>

                                        <div className="input">
                                          <label>
                                            <span>Max Guests</span>
                                          </label>
                                          <input
                                            type="number"
                                            min="1"
                                            value={slot.maxGuests}
                                            onChange={(e) => updateAvailabilitySlot(index, 'maxGuests', e.target.value)}
                                            onFocus={handleInputFocus}
                                            onBlur={handleInputBlur}
                                          />
                                        </div>

                                        <div className="input">
                                          <label>
                                            <span>Available</span>
                                          </label>
                                          <div style={{ display: 'flex', alignItems: 'center', paddingTop: '10px' }}>
                                            <input
                                              type="checkbox"
                                              checked={slot.available}
                                              onChange={(e) => updateAvailabilitySlot(index, 'available', e.target.checked)}
                                              style={{ width: 'auto', marginRight: '8px' }}
                                            />
                                            <span>{slot.available ? 'Yes' : 'No'}</span>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="block" data-block="1BAC">
                                        <div className="buttons">
                                          <button 
                                            type="button"
                                            className="button small" 
                                            onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              removeAvailabilitySlot(index, e);
                                            }} 
                                            style={{ cursor: 'pointer', border: 'none', background: 'transparent', padding: 0, width: '100%' }}
                                          >
                                            <div className="action">
                                              <div className="text">Remove</div>
                                            </div>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                </div>
                              )}

                              <div className="block" data-block="1C">
                                <div className="buttons">
                                  <div className="button small" data-button="1A" onClick={addAvailabilitySlot} style={{ cursor: 'pointer' }}>
                                    <div className="action">
                                      <div className="text">Add Availability Slot</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="block" data-block="1C">
                              <div className="buttons">
                                <button 
                                  type="submit" 
                                  className="button medium" 
                                  data-button="1A"
                                  disabled={isSubmitting}
                                >
                                  <div className="action">
                                    <div className="text">{isSubmitting ? 'Saving...' : (isEditMode ? 'Update Experience' : 'Create Experience')}</div>
                                  </div>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

