import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class GeminiAPITest {
    public static void main(String[] args) {
        String apiKey = "AIzaSyD02OXzVpMi0qnMScVZ8zg0yhKqTSk3SAE";
        String model = "gemini-1.5-flash";
        String prompt = "Say hello in 5 words";

        try {
            // Build request body
            Gson gson = new Gson();
            JsonObject requestBody = new JsonObject();
            JsonArray contents = new JsonArray();
            JsonObject content = new JsonObject();
            JsonArray parts = new JsonArray();
            JsonObject part = new JsonObject();
            part.addProperty("text", prompt);
            parts.add(part);
            content.add("parts", parts);
            contents.add(content);
            requestBody.add("contents", contents);

            String url = String.format(
                    "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
                    model, apiKey);

            System.out.println("URL: " + url);
            System.out.println("Request Body: " + requestBody.toString());

            // Make HTTP request
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody.toString()))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            System.out.println("Status Code: " + response.statusCode());
            System.out.println("Response: " + response.body());

            if (response.statusCode() == 200) {
                JsonObject jsonResponse = gson.fromJson(response.body(), JsonObject.class);
                String aiResponse = jsonResponse
                        .getAsJsonArray("candidates")
                        .get(0).getAsJsonObject()
                        .getAsJsonObject("content")
                        .getAsJsonArray("parts")
                        .get(0).getAsJsonObject()
                        .get("text").getAsString();

                System.out.println("\n✅ SUCCESS! Gemini said: " + aiResponse);
            } else {
                System.out.println("\n❌ ERROR: " + response.body());
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
