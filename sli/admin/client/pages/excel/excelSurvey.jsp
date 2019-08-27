<%@ page language="java"
    contentType="application/vnd.ms-excel; charset=euc-kr"
    pageEncoding="EUC-KR" import="java.util.*"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ page import="java.text.SimpleDateFormat"%>
<%
    SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmss", Locale.KOREA);
    String today = format.format(new Date());

    response.setHeader("Content-Type", "application/vnd.ms-xls");
    response.setHeader("Content-Disposition", "attachment; filename=survey_" + today + ".xls");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="ko" style="overflow: hidden">
<head>
<meta http-equiv="content-type" content="text/html; euc-kr" />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>엑셀 다운로드</title>
<style>
.table-wrapper-scroll-y {
    display: block;
    max-height: 700px;
    overflow-y: auto;
    -ms-overflow-style: -ms-autohiding-scrollbar;
}
</style>
</head>
<body>
    <table style="background: #ffffff">
    	<tbody>
    		<tr>
    			<th>고객사명</th>
    			<td>${statsInfo.compNm}</td>
    			<th>강의기간</th>
    			<td>${statsInfo.startDt} ~ ${statsInfo.endDt}</td>
    		</tr>
    		<tr>
    			<th>강사명</th>
    			<td>${statsInfo.teacherNm}</td>
    			<th>강의명</th>
    			<td>${statsInfo.lectureNm}</td>
    		</tr>
    		<tr>
    			<th>만족도 평균</th>
    			<td>${statsInfo.survAvg}</td>
    			<th>인원(응답/총)</th>
    			<td>${statsInfo.answerUserCnt}명 / ${statsInfo.totalUserCnt}명</td>
    		</tr>
    		<tr>
    			<td colspan="4"></td>
    		</tr>
        	<c:forEach var="x" items="${statsTitleList}" varStatus="status">
        		<c:if test="${x.survType eq 'M' }">
	                <tr>
	                    <td colspan="4">
	                    	${status.count}.${x.survTitle}
	                    	<c:if test="${x.avgYn == 'Y' }"> 
	                    	평균 : ${x.subAvg}점
	                    	</c:if>
	                    </td>
	                </tr>
	                <c:forEach var="y" items="${x.multiList }" varStatus="status2">
	                	<tr>
	                		<td>
	                		</td>
	                		<td colspan="2">
	                			${y.survNm} (${y.selectCnt})
	                		</td>
	                		<td>
	                			<fmt:formatNumber value="${y.selectCnt/x.selectTotal* 100 }" pattern="#,###.0" />%
	                		</td>
	                	</tr>
	            	</c:forEach>
            	</c:if>
        		<c:if test="${x.survType eq 'S' }">
	                <tr>
	                    <td colspan="4">${x.orderNo}.${x.survTitle}</td>
	                </tr>
	                <c:forEach var="y" items="${x.essayList }" varStatus="status2">
		                <tr>
		                	<td></td>
		                	<td colspan="3">- ${y.selectCnts}</td>
		                </tr>
	                </c:forEach>
        		</c:if>
            </c:forEach>
        </tbody>
    </table>
 
</body>
</html>
