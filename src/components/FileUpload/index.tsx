/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import { useState } from 'react';

interface UploadedBlob {
  blobId: string;
  status: string;
  endEpoch: number;
  suiRef: string;
  suiRefType: string;
  suiBaseUrl: string;
  blobUrl: string;
  mediaType: string;
}

export const FileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedBlobs, setUploadedBlobs] = useState<UploadedBlob[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [publisherUrl, setPublisherUrl] = useState('https://publisher.walrus-testnet.walrus.space');
  const [aggregatorUrl, setAggregatorUrl] = useState('https://aggregator.walrus-testnet.walrus.space');
  const [epochs, setEpochs] = useState(1);
  const [sendTo, setSendTo] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const SUI_NETWORK = "testnet";
  const SUI_VIEW_TX_URL = `https://suiscan.xyz/${SUI_NETWORK}/tx`;
  const SUI_VIEW_OBJECT_URL = `https://suiscan.xyz/${SUI_NETWORK}/object`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const storeBlob = async (file: File): Promise<{ info: any; media_type: string }> => {
    const sendToParam = sendTo.trim() ? `&send_object_to=${sendTo}` : "";

    const response = await fetch(`${publisherUrl}/v1/blobs?epochs=${epochs}${sendToParam}`, {
      method: "PUT",
      body: file,
    });

    if (response.status === 200) {
      const info = await response.json();
      return { info, media_type: file.type };
    } else {
      throw new Error("Something went wrong when storing the blob!");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const { info, media_type } = await storeBlob(selectedFile);

      let uploadInfo;
      if ("alreadyCertified" in info) {
        uploadInfo = {
          status: "Already certified",
          blobId: info.alreadyCertified.blobId,
          endEpoch: info.alreadyCertified.endEpoch,
          suiRefType: "Previous Sui Certified Event",
          suiRef: info.alreadyCertified.event.txDigest,
          suiBaseUrl: SUI_VIEW_TX_URL,
        };
      } else if ("newlyCreated" in info) {
        uploadInfo = {
          status: "Newly created",
          blobId: info.newlyCreated.blobObject.blobId,
          endEpoch: info.newlyCreated.blobObject.storage.endEpoch,
          suiRefType: "Associated Sui Object",
          suiRef: info.newlyCreated.blobObject.id,
          suiBaseUrl: SUI_VIEW_OBJECT_URL,
        };
      } else {
        throw new Error("Unhandled successful response!");
      }

      const blobUrl = `${aggregatorUrl}/v1/blobs/${uploadInfo.blobId}`;
      const suiUrl = `${uploadInfo.suiBaseUrl}/${uploadInfo.suiRef}`;

      //console.log("Blob URL:", blobUrl);
      console.log("Sui URL:", suiUrl);
      const newBlob: UploadedBlob = {
        ...uploadInfo,
        blobUrl,
        mediaType: media_type,
      };

      setUploadedBlobs(prev => [newBlob, ...prev]);
      setSelectedFile(null);

      // Reset form
      const form = document.getElementById('upload-form') as HTMLFormElement;
      form.reset();

    } catch (error) {
      console.error(error);
      setError("An error occurred while uploading. Check the browser console and ensure that the aggregator and publisher URLs are correct.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 rounded-xl w-full border-2 border-gray-200 p-6 bg-white shadow-sm">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Walrus Blob Upload</h2>
        <p className="text-sm text-gray-600">
          Upload blobs to Walrus and display them. File size is limited to 10 MiB on the default publisher.
        </p>
      </div>


      <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Walrus Publisher URL</label>
            <input
              type="url"
              value={publisherUrl}
              onChange={(e) => setPublisherUrl(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Walrus Aggregator URL</label>
            <input
              type="url"
              value={aggregatorUrl}
              onChange={(e) => setAggregatorUrl(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        */}

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Blob to upload <span className="text-red-500">(Max 10 MiB size)</span>
          </label>
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Epochs</label>
          <input
            type="number"
            value={epochs}
            onChange={(e) => setEpochs(parseInt(e.target.value))}
            min="1"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <span className="text-xs text-gray-500">
            The number of Walrus epochs for which to store the blob.
          </span>
        </div>
        {/*
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Send to (optional)</label>
          <input
            type="text"
            value={sendTo}
            onChange={(e) => setSendTo(e.target.value)}
            placeholder="0x9d8a07f9f5cb4d10ad3a8c949f17b9ae6c51fc76c2b7ef62dc5babec551e79e6"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-xs text-gray-500">
            The address to which the newly created Blob object should be sent.
          </span>
        </div>
           */}

        <Button
          type="submit"
          disabled={isUploading}
          size="lg"
          variant="primary"
          className="w-full"
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {uploadedBlobs.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-gray-800">Uploaded Blobs</h3>
          <div className="flex flex-col gap-4">
            {uploadedBlobs.map((blob, index) => (
              <div key={index} className="flex gap-4 p-4 border border-gray-200 rounded-md">
                {blob.mediaType.startsWith('image') && (
                  <img
                    src={blob.blobUrl}
                    alt="Uploaded blob"
                    className="w-24 h-24 object-cover rounded-md"
                  />
                )}
                <div className="flex-1 flex flex-col gap-2 text-sm">
                  <div>
                    <span className="font-medium">Status:</span> {blob.status}
                  </div>
                  <div>
                    <span className="font-medium">Blob ID:</span>{' '}
                    <a href={blob.blobUrl} className="text-blue-600 hover:underline truncate">
                      {blob.blobId}
                    </a>
                  </div>
                  <div>
                    <span className="font-medium">{blob.suiRefType}:</span>{' '}
                    <a
                      href={`${blob.suiBaseUrl}/${blob.suiRef}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate"
                    >
                      {blob.suiRef}
                    </a>
                  </div>
                  <div>
                    <span className="font-medium">Stored until epoch:</span> {blob.endEpoch}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};