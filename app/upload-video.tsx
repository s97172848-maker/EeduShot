import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions
} from 'react-native';
import tw from 'twrnc';
import { COLORS, GRADIENTS } from '../constants/Colors';
import { useUser } from '../contexts/UserContext';

export default function UploadVideoScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { userRole, userRoleColor } = useUser();
  
  // Theme color based on user role
  const themeColor = userRoleColor || COLORS.PRIMARY;
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [customCategory, setCustomCategory] = useState<string>('');
  const [contentType, setContentType] = useState<'reel' | 'full-video'>('full-video');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Responsive sizing
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  
  const baseSpacing = isSmallScreen ? 8 : isMediumScreen ? 12 : 16;
  const spacing = {
    xs: baseSpacing * 0.5,
    sm: baseSpacing * 0.75,
    md: baseSpacing,
    lg: baseSpacing * 1.5,
    xl: baseSpacing * 2,
    xxl: baseSpacing * 3,
  };

  const dimensions = {
    titleSize: isSmallScreen ? 16 : isMediumScreen ? 18 : 20,
    subtitleSize: isSmallScreen ? 12 : isMediumScreen ? 14 : 16,
    bodySize: isSmallScreen ? 10 : isMediumScreen ? 12 : 14,
    buttonHeight: isSmallScreen ? 44 : isMediumScreen ? 48 : 52,
    cardPadding: isSmallScreen ? 12 : isMediumScreen ? 16 : 20,
    iconSize: isSmallScreen ? 16 : isMediumScreen ? 18 : 20,
  };

  const horizontalPadding = isSmallScreen ? 16 : isMediumScreen ? 20 : 24;

  // Categories data
  const categories = [
    'Development', 'Design', 'Programming', 'Data Science', 
    'Mobile Apps', 'Web Development', 'UI/UX', 'Machine Learning',
    'Artificial Intelligence', 'Cybersecurity', 'Cloud Computing', 'DevOps'
  ];

  // Handle video selection
  const handleSelectVideo = () => {
    // TODO: Implement video picker
    setSelectedVideo('sample-video.mp4');
    Alert.alert('Video Selected', 'Sample video selected. In real app, this opens video picker.');
  };

  // Handle thumbnail selection
  const handleSelectThumbnail = () => {
    // TODO: Implement thumbnail picker
    setSelectedThumbnail('sample-thumbnail.jpg');
    Alert.alert('Thumbnail Selected', 'Sample thumbnail selected. In real app, this opens image picker.');
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validation
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a video title');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    if (!selectedCategory && !customCategory.trim()) {
      Alert.alert('Error', 'Please select a category or enter a custom category');
      return;
    }

    if (!selectedVideo) {
      Alert.alert('Error', 'Please select a video file');
      return;
    }

    setIsUploading(true);

    try {
      const res = await fetch('http://192.168.1.7:5000/api/auth/upload-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add Authorization header if needed
        },
        body: JSON.stringify({
          title,
          description,
          contentType: contentType === 'full-video' ? 'full' : 'reel',
          category: [selectedCategory || customCategory],
          customCategory: customCategory.trim() || undefined,
          videoUrl: selectedVideo, // Static string for now
          thumbnailUrl: selectedThumbnail || undefined // Static string for now
        })
      });
      if (res.ok) {
        Alert.alert('Success', 'Video uploaded successfully!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        const data = await res.json();
        Alert.alert('Error', data.message || 'Failed to upload video. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload video. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Render category item
  const renderCategoryItem = (category: string) => (
    <TouchableOpacity
      key={category}
      onPress={() => setSelectedCategory(category)}
      style={[
        tw`px-4 py-2 rounded-full mr-3 mb-3`,
        {
          backgroundColor: selectedCategory === category 
            ? themeColor + '30' 
            : 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          borderColor: selectedCategory === category 
            ? themeColor 
            : 'rgba(255, 255, 255, 0.2)',
        },
      ]}
    >
      <Text
        style={[
          tw`font-medium`,
          {
            fontFamily: 'Poppins-Medium',
            color: selectedCategory === category 
              ? themeColor 
              : COLORS.TEXT_WHITE,
            fontSize: dimensions.bodySize,
          },
        ]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );

  // Render content type selector
  const renderContentTypeSelector = () => (
    <View style={{ marginBottom: spacing.lg }}>
      <Text
        style={[
          tw`font-semibold mb-3`,
          {
            fontFamily: 'Poppins-SemiBold',
            color: COLORS.TEXT_WHITE,
            fontSize: dimensions.subtitleSize,
          },
        ]}
      >
        Content Type *
      </Text>
      
      <View style={tw`flex-row`}>
        <TouchableOpacity
          onPress={() => setContentType('reel')}
          style={[
            tw`flex-1 items-center py-4 rounded-xl mr-2`,
            {
              backgroundColor: contentType === 'reel' 
                ? themeColor + '20' 
                : 'rgba(255, 255, 255, 0.08)',
              borderWidth: 2,
              borderColor: contentType === 'reel' 
                ? themeColor 
                : 'rgba(255, 255, 255, 0.2)',
            },
          ]}
        >
          <Ionicons 
            name="phone-portrait" 
            size={32} 
            color={contentType === 'reel' ? themeColor : COLORS.TEXT_GRAY} 
          />
          <Text
            style={[
              tw`font-semibold mt-2`,
              {
                fontFamily: 'Poppins-SemiBold',
                color: contentType === 'reel' ? themeColor : COLORS.TEXT_WHITE,
                fontSize: dimensions.bodySize,
              },
            ]}
          >
            Reel
          </Text>
          <Text
            style={[
              tw`text-xs mt-1`,
              {
                fontFamily: 'Poppins-Medium',
                color: contentType === 'reel' ? themeColor + 'CC' : COLORS.TEXT_GRAY_LIGHT,
                fontSize: dimensions.bodySize - 2,
              },
            ]}
          >
            Short vertical video
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setContentType('full-video')}
          style={[
            tw`flex-1 items-center py-4 rounded-xl ml-2`,
            {
              backgroundColor: contentType === 'full-video' 
                ? themeColor + '20' 
                : 'rgba(255, 255, 255, 0.08)',
              borderWidth: 2,
              borderColor: contentType === 'full-video' 
                ? themeColor 
                : 'rgba(255, 255, 255, 0.2)',
            },
          ]}
        >
          <Ionicons 
            name="videocam" 
            size={32} 
            color={contentType === 'full-video' ? themeColor : COLORS.TEXT_GRAY} 
          />
          <Text
            style={[
              tw`font-semibold mt-2`,
              {
                fontFamily: 'Poppins-SemiBold',
                color: contentType === 'full-video' ? themeColor : COLORS.TEXT_WHITE,
                fontSize: dimensions.bodySize,
              },
            ]}
          >
            Full Video
          </Text>
          <Text
            style={[
              tw`text-xs mt-1`,
              {
                fontFamily: 'Poppins-Medium',
                color: contentType === 'full-video' ? themeColor + 'CC' : COLORS.TEXT_GRAY_LIGHT,
                fontSize: dimensions.bodySize - 2,
              },
            ]}
          >
            Complete tutorial
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={tw`flex-1`}>
      <StatusBar hidden={true} />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={GRADIENTS.BACKGROUND}
        style={tw`absolute inset-0`}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Header */}
      <LinearGradient
        colors={[themeColor + '20', 'rgba(255, 255, 255, 0.05)']}
        style={[
          tw`flex-row items-center px-6 py-4`,
          { borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.1)' }
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={[
            tw`rounded-full items-center justify-center mr-4`,
            {
              width: 40,
              height: 40,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          ]}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.TEXT_WHITE} />
        </TouchableOpacity>
        
        <Text
          style={[
            tw`font-bold text-xl`,
            {
              fontFamily: 'Poppins-Bold',
              color: COLORS.TEXT_WHITE,
            },
          ]}
        >
          Upload Video
        </Text>
      </LinearGradient>

      {/* Content */}
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={{ padding: horizontalPadding, paddingBottom: spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Input */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text
            style={[
              tw`font-semibold mb-2`,
              {
                fontFamily: 'Poppins-SemiBold',
                color: COLORS.TEXT_WHITE,
                fontSize: dimensions.subtitleSize,
              },
            ]}
          >
            Video Title *
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Enter video title..."
            placeholderTextColor={COLORS.TEXT_GRAY}
            style={[
              tw`rounded-xl px-4 py-3`,
              {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.1)',
                color: COLORS.TEXT_WHITE,
                fontFamily: 'Poppins-Medium',
                fontSize: dimensions.bodySize,
              },
            ]}
          />
        </View>

        {/* Description Input */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text
            style={[
              tw`font-semibold mb-2`,
              {
                fontFamily: 'Poppins-SemiBold',
                color: COLORS.TEXT_WHITE,
                fontSize: dimensions.subtitleSize,
              },
            ]}
          >
            Description *
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your video content..."
            placeholderTextColor={COLORS.TEXT_GRAY}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={[
              tw`rounded-xl px-4 py-3`,
              {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.1)',
                color: COLORS.TEXT_WHITE,
                fontFamily: 'Poppins-Medium',
                fontSize: dimensions.bodySize,
                minHeight: 100,
              },
            ]}
          />
        </View>

        {/* Content Type Selection */}
        {renderContentTypeSelector()}

                 {/* Category Selection */}
         <View style={{ marginBottom: spacing.lg }}>
           <Text
             style={[
               tw`font-semibold mb-3`,
               {
                 fontFamily: 'Poppins-SemiBold',
                 color: COLORS.TEXT_WHITE,
                 fontSize: dimensions.subtitleSize,
               },
             ]}
           >
             Category *
           </Text>
           <View style={tw`flex-row flex-wrap`}>
             {categories.map(renderCategoryItem)}
           </View>
           
           {/* Custom Category Input */}
           <View style={{ marginTop: spacing.md }}>
             <Text
               style={[
                 tw`font-medium mb-2`,
                 {
                   fontFamily: 'Poppins-Medium',
                   color: COLORS.TEXT_GRAY_LIGHT,
                   fontSize: dimensions.bodySize,
                 },
               ]}
             >
               Or enter custom category:
             </Text>
             <TextInput
               value={customCategory}
               onChangeText={setCustomCategory}
               placeholder="Enter custom category..."
               placeholderTextColor={COLORS.TEXT_GRAY}
               style={[
                 tw`rounded-xl px-4 py-3`,
                 {
                   backgroundColor: 'rgba(255, 255, 255, 0.08)',
                   borderWidth: 1,
                   borderColor: customCategory.trim() ? themeColor : 'rgba(255, 255, 255, 0.1)',
                   color: COLORS.TEXT_WHITE,
                   fontFamily: 'Poppins-Medium',
                   fontSize: dimensions.bodySize,
                 },
               ]}
             />
           </View>
         </View>

        {/* Video Selection */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text
            style={[
              tw`font-semibold mb-2`,
              {
                fontFamily: 'Poppins-SemiBold',
                color: COLORS.TEXT_WHITE,
                fontSize: dimensions.subtitleSize,
              },
            ]}
          >
            Video File *
          </Text>
          <TouchableOpacity
            onPress={handleSelectVideo}
            style={[
              tw`rounded-xl border-2 border-dashed items-center justify-center py-8`,
              {
                borderColor: selectedVideo ? themeColor : 'rgba(255, 255, 255, 0.3)',
                backgroundColor: selectedVideo ? themeColor + '15' : 'rgba(255, 255, 255, 0.05)',
              },
            ]}
          >
            {selectedVideo ? (
              <View style={tw`items-center`}>
                <Ionicons name="checkmark-circle" size={48} color={themeColor} />
                <Text
                  style={[
                    tw`font-semibold mt-2`,
                    {
                      fontFamily: 'Poppins-SemiBold',
                      color: themeColor,
                      fontSize: dimensions.bodySize,
                    },
                  ]}
                >
                  Video Selected
                </Text>
              </View>
            ) : (
              <View style={tw`items-center`}>
                <Ionicons name="videocam" size={48} color={COLORS.TEXT_GRAY} />
                <Text
                  style={[
                    tw`font-semibold mt-2`,
                    {
                      fontFamily: 'Poppins-SemiBold',
                      color: COLORS.TEXT_GRAY,
                      fontSize: dimensions.bodySize,
                    },
                  ]}
                >
                  Select Video File
                </Text>
                <Text
                  style={[
                    tw`text-xs mt-1`,
                    {
                      fontFamily: 'Poppins-Medium',
                      color: COLORS.TEXT_GRAY_DARK,
                      fontSize: dimensions.bodySize - 2,
                    },
                  ]}
                >
                  MP4, MOV, AVI (Max 500MB)
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Thumbnail Selection */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text
            style={[
              tw`font-semibold mb-2`,
              {
                fontFamily: 'Poppins-SemiBold',
                color: COLORS.TEXT_WHITE,
                fontSize: dimensions.subtitleSize,
              },
            ]}
          >
            Thumbnail Image
          </Text>
          <TouchableOpacity
            onPress={handleSelectThumbnail}
            style={[
              tw`rounded-xl border-2 border-dashed items-center justify-center py-6`,
              {
                borderColor: selectedThumbnail ? themeColor : 'rgba(255, 255, 255, 0.3)',
                backgroundColor: selectedThumbnail ? themeColor + '15' : 'rgba(255, 255, 255, 0.05)',
              },
            ]}
          >
            {selectedThumbnail ? (
              <View style={tw`items-center`}>
                <Ionicons name="checkmark-circle" size={40} color={themeColor} />
                <Text
                  style={[
                    tw`font-semibold mt-2`,
                    {
                      fontFamily: 'Poppins-SemiBold',
                      color: themeColor,
                      fontSize: dimensions.bodySize,
                    },
                  ]}
                >
                  Thumbnail Selected
                </Text>
              </View>
            ) : (
              <View style={tw`items-center`}>
                <Ionicons name="image" size={40} color={COLORS.TEXT_GRAY} />
                <Text
                  style={[
                    tw`font-semibold mt-2`,
                    {
                      fontFamily: 'Poppins-SemiBold',
                      color: COLORS.TEXT_GRAY,
                      fontSize: dimensions.bodySize,
                    },
                  ]}
                >
                  Select Thumbnail
                </Text>
                <Text
                  style={[
                    tw`text-xs mt-1`,
                    {
                      fontFamily: 'Poppins-Medium',
                      color: COLORS.TEXT_GRAY_DARK,
                      fontSize: dimensions.bodySize - 2,
                    },
                  ]}
                >
                  JPG, PNG (Recommended: 1280x720)
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Upload Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isUploading}
          style={[
            tw`rounded-xl items-center justify-center py-4`,
            {
              backgroundColor: isUploading ? COLORS.TEXT_GRAY : themeColor,
              opacity: isUploading ? 0.6 : 1,
              shadowColor: themeColor,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            },
          ]}
        >
          <View style={tw`flex-row items-center`}>
            {isUploading ? (
              <>
                <Ionicons name="sync" size={20} color={COLORS.TEXT_WHITE} />
                <Text
                  style={[
                    tw`font-semibold ml-2`,
                    {
                      fontFamily: 'Poppins-SemiBold',
                      color: COLORS.TEXT_WHITE,
                      fontSize: dimensions.subtitleSize,
                    },
                  ]}
                >
                  Uploading...
                </Text>
              </>
            ) : (
              <>
                <Ionicons name="cloud-upload" size={20} color={COLORS.TEXT_WHITE} />
                <Text
                  style={[
                    tw`font-semibold ml-2`,
                    {
                      fontFamily: 'Poppins-SemiBold',
                      color: COLORS.TEXT_WHITE,
                      fontSize: dimensions.subtitleSize,
                    },
                  ]}
                >
                  Upload Video
                </Text>
              </>
            )}
          </View>
        </TouchableOpacity>

        {/* Bottom Spacing */}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </View>
  );
}
