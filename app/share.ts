import {ActivityItem} from 'react-native-share/src/types';
import {ShareOptions} from 'react-native-share/lib/typescript/types';
import {Platform} from 'react-native';
import Share from 'react-native-share';

export const ShareUrl = async (title: string, message: string, url: string) => {
  const icon = 'data:<data_type>/<file_extension>;base64,<base64_data>';
  const iosItemText: ActivityItem = {
    type: 'text',
    content: `${message} ${url}`,
  };
  const iosItemURL: ActivityItem = {
    type: 'url',
    content: url,
  };
  const options: ShareOptions = Platform.select<ShareOptions>({
    ios: {
      title,
      subject: title,
      message: `${title} ${url}`,
      failOnCancel: false,
      activityItemSources: [
        {
          placeholderItem: iosItemURL,
          item: {
            default: iosItemURL,
            addToReadingList: iosItemURL,
            airDrop: iosItemURL,
            assignToContact: iosItemURL,
            copyToPasteBoard: iosItemURL,
            mail: iosItemURL,
            message: iosItemURL,
            openInIBooks: iosItemURL,
            postToFacebook: iosItemURL,
            postToFlickr: iosItemURL,
            postToTencentWeibo: iosItemURL,
            postToTwitter: iosItemURL,
            postToVimeo: iosItemURL,
            postToWeibo: iosItemURL,
            print: iosItemURL,
            saveToCameraRoll: iosItemURL,
            markupAsPDF: iosItemURL,
          },
          subject: {
            default: title,
            addToReadingList: title,
            airDrop: title,
            assignToContact: title,
            copyToPasteBoard: title,
            mail: title,
            message: title,
            openInIBooks: title,
            postToFacebook: title,
            postToFlickr: title,
            postToTencentWeibo: title,
            postToTwitter: title,
            postToVimeo: title,
            postToWeibo: title,
            print: title,
            saveToCameraRoll: title,
            markupAsPDF: title,
          },
          linkMetadata: {originalUrl: url, url, title},
        },
        {
          // For using custom icon instead of default text icon at share preview when sharing with message.
          placeholderItem: {
            type: 'url',
            content: icon,
          },
          item: {
            default: iosItemText,
            addToReadingList: iosItemText,
            airDrop: iosItemText,
            assignToContact: iosItemText,
            copyToPasteBoard: iosItemURL,
            mail: iosItemText,
            message: iosItemText,
            openInIBooks: iosItemText,
            postToFacebook: iosItemURL,
            postToFlickr: iosItemURL,
            postToTencentWeibo: iosItemURL,
            postToTwitter: iosItemURL,
            postToVimeo: iosItemURL,
            postToWeibo: iosItemURL,
            print: iosItemURL,
            saveToCameraRoll: iosItemText,
            markupAsPDF: iosItemText,
          },
          linkMetadata: {
            title: message,
            icon: icon,
          },
        },
      ],
    },
    default: {
      title,
      subject: title,
      message: `${title} ${url}`,
      failOnCancel: false,
    },
  });
  await Share.open(options);
};
