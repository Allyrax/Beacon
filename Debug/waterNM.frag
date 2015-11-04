#version 430 core

out vec4 color;

layout (binding = 0) uniform sampler2D texDisplacement;
uniform vec3 lightPos;
uniform float lightPower;
uniform vec3 lightColor;
uniform vec3 eyePos;
uniform vec3 lightPosCorrect;

uniform vec3 diffuseColor;
uniform vec3 specularColor;
uniform vec3 reflectionColor;
uniform float alpha;

in GS_OUT {
	vec2 textureCoord;
	vec3 normal;
	vec3 position;
} fsIn;

void main(void) {
	vec3 eye_vector = normalize(vec3(0.0, 0.0, 1.0) - fsIn.position);
	vec3 light_vector = normalize(lightPos - fsIn.position);
	float distance = length(eyePos - lightPos);
	vec3 R = normalize(reflect(light_vector, fsIn.normal));
	float cos = clamp(dot(R, eye_vector), 0, 1);

	vec3 reflectionColorComp = clamp(reflectionColor * 50 * pow(cos, 1.0)/(distance*distance), 0, 1);

	
	vec3 eyeVecCorr = normalize(vec3(0.0, 0.0, 0.0) - fsIn.position);
	vec3 lightVecCorr = normalize(lightPosCorrect - fsIn.position);
	float distanceCorr = length(lightPosCorrect);
	vec3 reflectCorr = normalize(reflect(-lightVecCorr, fsIn.normal));
	float cosCorr = clamp(dot(eyeVecCorr, reflectCorr), 0, 1);

	float powCosCorr = pow(cosCorr, 60);
	vec3 specularColorComp = clamp(specularColor * alpha * powCosCorr/(distanceCorr), 0, 1);
	vec3 diffuseColorComp = clamp(diffuseColor, 0, 1);

	float texColor = texture(texDisplacement, fsIn.textureCoord).r;

	float alphaComp = (1 - clamp(dot(fsIn.normal, normalize(fsIn.position)), 0, 1))/3;
	float alpha2 = clamp(dot(fsIn.normal, normalize(fsIn.position))+0.6, 0, 1);

	alphaComp = max(alphaComp, alpha2);
	alphaComp = max(alphaComp, powCosCorr/2);

	//alphaComp = alpha;

	color = vec4(specularColorComp + reflectionColorComp + diffuseColorComp, alphaComp);
}